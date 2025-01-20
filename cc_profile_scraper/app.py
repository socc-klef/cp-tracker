import re

import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)
CORS(app,origins="*")

# Constants
BASE_URL = "https://www.codechef.com/users/"
CONTEST_URL = "https://www.codechef.com/rankings/"
coderDiv = ["Grey", "Green", "Blue", "Violet", "Yellow", "Orange", "Red"]


def fetch_page_content(url):
    """Fetches the HTML content of a given URL with proper headers."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch the page: {str(e)}"}


def extract_text_or_none(element, selector, attr=None):
    """Extracts text or attribute from an element with improved error handling."""
    if not element:
        return None
    selected = element.select_one(selector)
    if not selected:
        return None
    try:
        return selected.get(attr).strip() if attr else selected.text.strip()
    except (AttributeError, TypeError):
        return None


def parse_learning_path(container):
    """Parse learning path information from a card container."""
    paths = []
    for card in container.select('a'):
        title_elem = card.select_one('p.card__title')
        progress_elem = card.select_one('span.tooltiptext')

        if title_elem and progress_elem:
            path = {
                'title': title_elem.text.strip(),
                'progress': progress_elem.text.strip(),
                'url': f"https://www.codechef.com{card['href']}" if 'href' in card.attrs else None
            }
            paths.append(path)
    return paths


def parse_contest_section(section):
    """Parse contest participation details."""
    contests = []
    for content_div in section.select('div.content'):
        contest_title = content_div.select_one('h5 span')
        problems = content_div.select('p span span')

        if contest_title:
            contest = {
                'name': contest_title.text.strip(),
                'problems_solved': [
                    prob.text.strip() for prob in problems if prob.text.strip()
                ]
            }
            contests.append(contest)
    return contests


def parse_submission_status(status_cell):
    """Parse the complex submission status cell structure."""
    if not status_cell:
        return None

    status_span = status_cell.find('span')
    if not status_span:
        return None

    # Get the status from the title attribute
    status = status_span.get('title', '').strip()

    # Check for score in the span text
    score_span = status_span.find('span', text=lambda t: t and '(' in t)
    score = None
    if score_span:
        score_text = score_span.text.strip('()')
        score = int(score_text) if score_text.isdigit() else None

    # Determine status type based on image
    status_img = status_span.find('img')
    status_type = 'unknown'
    if status_img and status_img.get('src'):
        img_src = status_img['src'].lower()
        if 'tick-icon' in img_src:
            status_type = 'accepted'
        elif 'cross-icon' in img_src:
            status_type = 'wrong'
        elif 'clock_error' in img_src:
            status_type = 'tle'

    return {
        'status': status,
        'type': status_type,
        'score': score
    }


def parse_recent_submissions(soup):
    """Parse the recent submissions table with the updated HTML structure."""
    submissions = []

    # Find the recent activity widget
    activity_div = soup.select_one('div.widget.recent-activity')
    if not activity_div:
        return submissions

    # Find the data table
    table = activity_div.select_one('table.dataTable')
    if not table:
        return submissions

    # Process each row in the tbody
    for row in table.select('tbody tr'):
        cols = row.find_all('td')
        if len(cols) < 5:  # We expect 5 columns
            continue

        # Parse timestamp
        timestamp_span = cols[0].select_one('span.tooltiptext')
        timestamp = timestamp_span.text.strip() if timestamp_span else None

        # Parse problem details
        problem_link = cols[1].find('a')
        problem = {
            'name': problem_link.text.strip() if problem_link else None,
            'code': problem_link['href'].split('/')[-1] if problem_link and 'href' in problem_link.attrs else None,
            'contest_code': problem_link['href'].split('/')[
                -2] if problem_link and 'href' in problem_link.attrs else None,
            'url': f"https://www.codechef.com{problem_link['href']}" if problem_link and 'href' in problem_link.attrs else None
        }

        # Parse status
        status = parse_submission_status(cols[2])

        # Create submission entry
        submission = {
            'timestamp': timestamp,
            'problem': problem,
            'status': status,
            'language': cols[3].get('title', '').strip(),
            'solution_url': f"https://www.codechef.com{cols[4].find('a')['href']}" if cols[4].find('a') else None
        }

        submissions.append(submission)

    # Check for pagination
    pagination_div = activity_div.select_one('div.pageinfo')
    if pagination_div:
        current_page = None
        total_pages = None
        try:
            page_text = pagination_div.text.strip()
            if 'of' in page_text:
                current_page, total_pages = map(int, page_text.split('of'))
        except (ValueError, AttributeError):
            pass

        if current_page and total_pages:
            submissions.append({
                'pagination': {
                    'current_page': current_page,
                    'total_pages': total_pages
                }
            })

    return submissions


def parse_problem_stats(soup):
    """Parses the user's problem-solving statistics."""
    stats = {
        'fully_solved': {'count': 0, 'problems': []},
        'partially_solved': {'count': 0, 'problems': []},
        'attempted': {'count': 0, 'problems': []}
    }

    for category in ['fully-solved', 'partially-solved']:
        section = soup.select_one(f'section.problems-solved.{category}')
        if section:
            problems = section.select('article a')
            category_key = category.replace('-', '_')
            stats[category_key]['count'] = len(problems)
            stats[category_key]['problems'] = [
                {
                    'code': prob['href'].split('/')[-1],
                    'name': prob.text.strip(),
                    'url': f"https://www.codechef.com{prob['href']}"
                }
                for prob in problems if 'href' in prob.attrs
            ]

    return stats


def parse_user_statistics(soup):
    """Parse all user statistics including learning paths, practice paths, and contests."""
    stats_section = soup.select_one('section.rating-data-section.problems-solved')
    if not stats_section:
        return None

    statistics = {
        'learning_paths': [],
        'practice_paths': [],
        'contests': [],
        'total_problems_solved': 0
    }

    # Parse total problems solved
    total_problems = stats_section.select_one('h3:contains("Total Problems Solved")')
    if total_problems:
        try:
            statistics['total_problems_solved'] = int(total_problems.text.split(':')[-1].strip())
        except (ValueError, AttributeError):
            pass

    # Parse Learning Paths
    learning_paths_container = stats_section.select_one('h3:contains("Learning Paths") + div.cards__container')
    if learning_paths_container:
        statistics['learning_paths'] = parse_learning_path(learning_paths_container)

    # Parse Practice Paths
    practice_paths_container = stats_section.select_one('h3:contains("Practice Paths") + div.cards__container')
    if practice_paths_container:
        statistics['practice_paths'] = parse_learning_path(practice_paths_container)

    # Parse Contests
    contests_section = stats_section.select_one('h3:contains("Contests")')
    if contests_section:
        # Get the contest count from the heading
        contest_count_match = re.search(r'Contests \((\d+)\)', contests_section.text)
        if contest_count_match:
            statistics['contest_count'] = int(contest_count_match.group(1))

        # Parse individual contests
        statistics['contests'] = parse_contest_section(stats_section)

    return statistics


def scrape_codechef_profile(username):
    """Enhanced scraper function that collects comprehensive profile data."""
    url = f"{BASE_URL}{username}"
    html_content = fetch_page_content(url)

    if isinstance(html_content, dict) and "error" in html_content:
        return html_content

    soup = BeautifulSoup(html_content, 'html.parser')

    # Basic profile details
    name = extract_text_or_none(soup, 'h1.h2-style')
    rating = extract_text_or_none(soup, 'div.rating-number')

    if not rating:
        return {"error": "Profile not found or unable to access data"}

    # Parse all the different sections
    profile_data = {
        "username": username,
        "name": name,
        "current_rating": int(rating),
        "highest_rating": int(
            extract_text_or_none(soup, 'div.rating-header small').split()[-1][:-1] if extract_text_or_none(
                soup, 'div.rating-header small') else 0
        ),
        "contests": parse_user_statistics(soup).get('contests', []),
        "total_problems_solved": parse_user_statistics(soup).get('total_problems_solved', 0),
    }

    return profile_data


@app.route('/get-cc-data', methods=['GET'])
def scrape_user_data():
    username = request.args.get('uname')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    profile_data = scrape_codechef_profile(username)

    return jsonify(profile_data)

@app.route("/", methods=["GET"])
def test():
    print("http://localhost:5000/get-cc-data?uname=klu2200031641")
    return "LMAO"

if __name__ == '__main__':
    app.run(debug=True)
