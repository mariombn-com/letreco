#!/usr/bin/env python3
"""
Gera os ícones para o app Appalavra
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Cores do tema
VERMELHO_SANGUE = (139, 0, 0)  # #8B0000 - vermelho sangue
AMARELO_MANTEIGA = (255, 228, 181)  # #FFE4B5 - amarelo manteiga
FUNDO_ESCURO = (26, 26, 26)  # #1a1a1a

def create_icon(size, output_path):
    """Cria um ícone com a letra A estilizada"""
    # Criar imagem com fundo vermelho sangue
    img = Image.new('RGB', (size, size), VERMELHO_SANGUE)
    draw = ImageDraw.Draw(img)
    
    # Tamanho da fonte baseado no tamanho da imagem
    font_size = int(size * 0.7)
    
    try:
        # Tentar usar uma fonte mais bonita
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/SFNSDisplay.ttf", font_size)
        except:
            # Fallback para fonte padrão
            font = ImageFont.load_default()
    
    # Desenhar a letra A no centro
    text = "A"
    
    # Obter o tamanho do texto para centralizar
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2 - bbox[0]
    y = (size - text_height) // 2 - bbox[1]
    
    # Desenhar a letra em amarelo manteiga
    draw.text((x, y), text, fill=AMARELO_MANTEIGA, font=font)
    
    # Salvar a imagem
    img.save(output_path)
    print(f"✓ Criado: {output_path}")

def create_favicon_ico():
    """Cria o arquivo favicon.ico com múltiplos tamanhos"""
    sizes = [16, 32, 48]
    images = []
    
    for size in sizes:
        img = Image.new('RGB', (size, size), VERMELHO_SANGUE)
        draw = ImageDraw.Draw(img)
        
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", int(size * 0.7))
        except:
            font = ImageFont.load_default()
        
        text = "A"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size - text_width) // 2 - bbox[0]
        y = (size - text_height) // 2 - bbox[1]
        
        draw.text((x, y), text, fill=AMARELO_MANTEIGA, font=font)
        images.append(img)
    
    # Salvar como .ico
    output_path = 'public/favicon.ico'
    images[0].save(output_path, format='ICO', sizes=[(s, s) for s in sizes])
    print(f"✓ Criado: {output_path}")

def main():
    # Criar diretório de ícones se não existir
    os.makedirs('public/icons', exist_ok=True)
    
    # Tamanhos necessários
    sizes = [48, 72, 96, 144, 168, 192, 512]
    
    # Gerar todos os ícones PNG
    for size in sizes:
        output_path = f'public/icons/{size}x{size}.png'
        create_icon(size, output_path)
    
    # Criar também o 32x32 mencionado no HTML
    create_icon(32, 'public/icons/32x32.png')
    
    # Criar o favicon.ico
    create_favicon_ico()
    
    # Criar splash.png e piquinim.png (mesma imagem)
    create_icon(512, 'public/splash.png')
    create_icon(512, 'public/piquinim.png')
    
    print("\n✅ Todos os ícones foram gerados com sucesso!")

if __name__ == '__main__':
    main()
