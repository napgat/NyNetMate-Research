"""
Auto Image Optimizer for Obsidian Vault (Img Directory)
-------------------------------------------------------
This script automatically detects uncompressed images (.png, .jpg, .jpeg) in the current
directory and compresses them while preserving crisp text readability for notes/diagrams.

Usage:
    python optimize_images.py
"""

import os
import sys
import warnings

# Suppress non-critical Pillow warnings
warnings.filterwarnings('ignore')

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library is not installed. Run 'pip install Pillow' first.")
    sys.exit(1)

# Ensure console supports UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Supported image extensions
IMAGE_EXTENSIONS = ('.png', '.jpg', '.jpeg')

def optimize_image(filepath):
    """
    Optimizes a single image file in-place if compression yields savings.
    Returns (original_size, new_size, saved_bytes).
    """
    orig_size = os.path.getsize(filepath)
    ext = os.path.splitext(filepath)[1].lower()
    temp_path = filepath + ".tmp"
    
    try:
        img = Image.open(filepath)
        
        if ext == '.png':
            if img.mode not in ('RGB', 'RGBA'):
                img = img.convert('RGB')
            # Adaptive 256-color palette compression (perfect for text/screenshots/diagrams)
            opt_img = img.convert('P', palette=Image.Palette.ADAPTIVE, colors=256)
            opt_img.save(temp_path, 'PNG', optimize=True, compress_level=9)
        elif ext in ('.jpg', '.jpeg'):
            if img.mode != 'RGB':
                img = img.convert('RGB')
            # High-quality JPEG compression
            img.save(temp_path, 'JPEG', quality=82, optimize=True, progressive=True)
        else:
            return orig_size, orig_size, 0
            
        new_size = os.path.getsize(temp_path)
        
        # Only overwrite if savings are meaningful (> 3% reduction)
        if new_size < orig_size * 0.97:
            os.replace(temp_path, filepath)
            saved = orig_size - new_size
            return orig_size, new_size, saved
        else:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return orig_size, orig_size, 0
            
    except Exception as err:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"  ⚠️ Error processing {os.path.basename(filepath)}: {err}")
        return orig_size, orig_size, 0

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    files = [
        f for f in os.listdir(script_dir)
        if f.lower().endswith(IMAGE_EXTENSIONS) and not f.startswith('.')
    ]
    
    if not files:
        print("ℹ️ No images found in this directory.")
        return

    print("==================================================")
    print(f"🖼️  MyNetMate Image Optimizer")
    print(f"📂 Scanning directory: {script_dir}")
    print(f"📊 Found {len(files)} image(s)")
    print("==================================================\n")

    total_orig = 0
    total_new = 0
    optimized_count = 0

    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(script_dir, filename)
        orig_s, new_s, saved = optimize_image(filepath)
        total_orig += orig_s
        total_new += new_s
        
        if saved > 0:
            optimized_count += 1
            percent = (saved / orig_s) * 100
            print(f"[{idx:02d}/{len(files)}] ✂️  {filename}")
            print(f"       {orig_s/1024:.1f} KB ➔ {new_s/1024:.1f} KB (Saved {saved/1024:.1f} KB, -{percent:.1f}%)")
        else:
            print(f"[{idx:02d}/{len(files)}] ✅ {filename} (Already optimal / No savings)")

    total_saved = total_orig - total_new
    print("\n==================================================")
    print("🎉 Optimization Complete Summary:")
    print(f"- Images Processed : {len(files)}")
    print(f"- Images Reduced   : {optimized_count}")
    print(f"- Original Size    : {total_orig / (1024*1024):.2f} MB")
    print(f"- Optimized Size   : {total_new / (1024*1024):.2f} MB")
    if total_saved > 0:
        print(f"- Total Space Saved: {total_saved / (1024*1024):.2f} MB (-{(total_saved/total_orig)*100:.1f}%)")
    else:
        print("- All images are already 100% optimized!")
    print("==================================================")

if __name__ == '__main__':
    main()
