import os
import re

# Путь к основной папке
base_folder = r"D:\CODE\germann\photo"

# Функция для извлечения цифр из строки
def extract_digits(s):
    return ''.join(filter(str.isdigit, s))

# Обработка всех элементов в базовой директории
for folder_name in os.listdir(base_folder):
    folder_path = os.path.join(base_folder, folder_name)

    # Пропускаем, если это не папка
    if not os.path.isdir(folder_path):
        continue

    # Извлекаем только цифры из имени папки
    digits_only = extract_digits(folder_name)
    if not digits_only:
        print(f"Папка '{folder_name}' не содержит цифр, пропускаем.")
        continue

    # Новое имя папки — только цифры
    new_folder_name = digits_only.zfill(4)  # Делаем 4-значным, например "0001"
    new_folder_path = os.path.join(base_folder, new_folder_name)

    # Если новое имя отличается — переименовываем
    if folder_path != new_folder_path:
        try:
            os.rename(folder_path, new_folder_path)
            print(f"Переименована папка '{folder_name}' -> '{new_folder_name}'")
            current_folder = new_folder_name
            folder_to_process = new_folder_path
        except FileExistsError:
            print(f"Папка '{new_folder_name}' уже существует, используем её.")
            current_folder = folder_name
            folder_to_process = folder_path
    else:
        current_folder = folder_name
        folder_to_process = folder_path

    # Обработка файлов внутри папки
    webp_files = [f for f in os.listdir(folder_to_process) if f.lower().endswith('.webp')]
    for idx, filename in enumerate(webp_files, start=1):
        old_path = os.path.join(folder_to_process, filename)
        new_filename = f"{current_folder}_{idx}.webp"
        new_path = os.path.join(folder_to_process, new_filename)

        # Переименовываем файл
        os.rename(old_path, new_path)
        print(f"Файл '{filename}' переименован в '{new_filename}'")

print("✅ Все файлы обработаны.")