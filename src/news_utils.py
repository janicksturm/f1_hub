from dotenv import load_dotenv
import os
from newsapi import NewsApiClient

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")

newsapi = NewsApiClient(api_key=API_KEY)

class NewsArticle:
    def __init__(self, title, description, url, source):
        self.title = title
        self.description = description
        self.url = url
        self.source = source

articles = newsapi.get_everything(
    q='"Formula 1" or "F1"',    
    language='en',
    sort_by='relevancy'
)

def get_top_6_articles():
    top_6_articles = []

    if len(articles['articles']) == 0:
        return top_6_articles

    for article in articles['articles'] [:6]:
        top_6_articles.append({
            "title": article['title'],
            "description": article['description'],
            "url": article['url'],
            "source": article['source']['name']
        })
    return top_6_articles