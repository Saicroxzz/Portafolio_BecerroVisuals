import os
from pathlib import Path
from PIL import Image

def convertir_jpg_a_webp():
    print("--- CONVERTIDOR DE JPG A WEBP (SIN PÉRDIDA) ---")
    
    # 1. Solicitar el nombre de la carpeta de destino en el Escritorio
    nombre_carpeta = input("Introduce el nombre de la carpeta para guardar las imágenes: ").strip()
    
    if not nombre_carpeta:
        print("El nombre de la carpeta no puede estar vacío.")
        return

    # 2. Obtener automáticamente la ruta del Escritorio
    escritorio = Path(os.path.expanduser("~")) / "Desktop"
    ruta_destino = escritorio / nombre_carpeta

    # 3. Crear la carpeta si no existe
    try:
        ruta_destino.mkdir(parents=True, exist_ok=True)
        print(f"\n[+] Carpeta de destino lista en: {ruta_destino}")
    except Exception as e:
        print(f"Error al crear la carpeta: {e}")
        return

    # 4. Solicitar la ruta de la carpeta donde están los JPGs actuales
    print("\n¿Dónde están tus imágenes JPG originales?")
    ruta_origen_input = input("Introduce la ruta de la carpeta origen (o arrástrala aquí): ").strip().strip('"\'')
    ruta_origen = Path(ruta_origen_input)

    if not ruta_origen.exists() or not ruta_origen.is_dir():
        print("La ruta de origen no es válida o no existe.")
        return

    # 5. Buscar imágenes JPG y JPEG (en mayúsculas y minúsculas)
    extensiones = ["*.jpg", "*.jpeg", "*.JPG", "*.JPEG"]
    imagenes_jpg = []
    for ext in extensiones:
        imagenes_jpg.extend(list(ruta_origen.glob(ext)))

    if not imagenes_jpg:
        print("No se encontraron imágenes .jpg o .jpeg en la carpeta especificada.")
        return

    print(f"\nSe encontraron {len(imagenes_jpg)} imágenes. Comenzando la conversión...")

    contador = 0
    for ruta_img in imagenes_jpg:
        try:
            # Abrir la imagen JPG
            with Image.open(ruta_img) as img:
                # Definir el nuevo nombre con extensión .webp
                nuevo_nombre = ruta_img.stem + ".webp"
                ruta_guardado = ruta_destino / nuevo_nombre
                
                # Convertir a RGB (por seguridad con algunos JPGs antiguos) y guardar sin pérdida
                img_rgb = img.convert("RGB")
                img_rgb.save(ruta_guardado, "WEBP", lossless=True, quality=100)
                
                print(f" -> Convertida: {ruta_img.name} => {nuevo_nombre}")
                contador += 1
        except Exception as e:
            print(f" No se pudo convertir {ruta_img.name}. Error: {e}")

    print(f"\n¡Proceso terminado! Se convirtieron {contador} imágenes con éxito.")
    print(f"Puedes revisar tus archivos en tu Escritorio dentro de la carpeta: '{nombre_carpeta}'")

if __name__ == "__main__":
    convertir_jpg_a_webp()