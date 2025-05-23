import requests
from bs4 import BeautifulSoup

# Замени URL на нужный тебе
url = 'https://semibrevis.se/2021_jury_rus.html'

# Отправляем GET-запрос
response = requests.get(url)

# Проверяем успешность запроса
if response.status_code != 200:
    print(f"Ошибка загрузки страницы: {response.status_code}")
    exit()

# Парсим HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Ищем блок с классом "posts"
posts_block = soup.find('div', class_='posts')

if not posts_block:
    print("Блок с классом 'posts' не найден")
    exit()

# Ищем все article внутри блока
articles = posts_block.find_all('article')

if not articles:
    print("Статьи не найдены")
    exit()

# Обрабатываем каждую статью
for i, article in enumerate(articles, start=1):
    h3 = article.find('h3')
    first_p_i = article.find('p')
    second_p = first_p_i.find_next_sibling('p') if first_p_i else None

    title = h3.get_text(strip=True) if h3 else "Нет заголовка"
    italic_text = first_p_i.get_text(strip=True) if first_p_i else "Нет курсивного текста"
    paragraph = second_p.get_text(strip=True) if second_p else "Нет основного параграфа"
    counter = 0
    names = [
        "Mats Widlund",
        "Rolf Lindblom",
        "Marc Power",
        "Kristoffer Dolatko",
        "Ivan Mikhaylov",
        "Stanislaw Tichonow",
        "Igor Tkatchouk",
        "Oleg Larionov",
        "Elena Power",
        "Yuriy Sayutkin",
        "Ola Karlsson",
        "Magnus Lanning",
        "Victoria Power",
        "Yan Shuang Lindblom",
        "Peter Schöning",
        "Claes Wahlroth",
        "Jekaterina Rostovtseva",
        "Marina Ruusmaa",
        "Eli-Marie Davidsen",
        "Stefan Mathiesen"
    ]
    for i in names:
        if i == title:
            print(f"\n---  ---")
            print(f"{title}")
            print(f"{italic_text}")
            print(f"{paragraph}")



