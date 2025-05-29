from flask import Flask, render_template, jsonify
import csv
import random


app = Flask(__name__)

CSV_FILE = 'D:/CODE/germann/server/pythonProject1/database/data.csv'

collections_colors = {
    "Exlibris": "#5e35b1",
    "All Hallows Eve": "#ff6f00",
    "Zodiac": "#1e88e5",
    "Lucky items": "#43a047",
    "Alchimia": "#8e24aa",
    "Baby dream": "#00acc1",
    "Futurism": "#f4511e",
    "Amore": "#e53935",
    "Beast": "#6d4c41"
}

def get_collection_color():
    pass
def read_products_from_csv():
    products = []
    with open(CSV_FILE, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)  # Читаем как словарь
        for row in reader:
            products.append(row)
    return products

@app.route('/')
def show_products():
    products = read_products_from_csv()
    random.shuffle(products)
    return render_template('products.html', products=products, collections_colors=collections_colors)

@app.route('/card')
def show_card():
    products = read_products_from_csv()
    random.shuffle(products)
    return render_template('card.html', product=get_product_by_sku("0052"), collections_colors=collections_colors)

@app.route('/api/products')
def api_products():
    collection = request.args.get('collection')
    products = get_products_by_collection(collection) if collection else read_products_from_csv()
    return jsonify(products)


def get_product_by_sku(sku):
    import csv
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['sku'] == sku:
                    return row
        return None
    except FileNotFoundError:
        return {'error': 'CSV file not found'}
    except Exception as e:
        return {'error': str(e)}

@app.route('/api/product-card/<sku>')
def get_product_card(sku):
    product = get_product_by_sku(sku)  # Реализуй поиск по SKU
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return render_template('card.html', product=product, collections_colors=collections_colors)

@app.route('/api/product/<product_id>')
def get_product_by_id(product_id):
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['sku'] == product_id:  # Предполагаем, что у вас есть столбец id
                    return jsonify(row)
        return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)