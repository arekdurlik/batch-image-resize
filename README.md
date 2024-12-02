# Batch Image Resizer

A React application for processing images in bulk. It offers a clear interface for resizing, cropping, and sharpening pictures, with options to apply changes to multiple images at once or individually.

[🌐Website](https://batchresizer.netlify.app/)

## Features

- **Multiple Image Variants**:
  - Define multiple variants for images, each with its own dimensions, aspect ratio, quality, and sharpening settings.
  - Save variant settings to a file or store them automatically in the browser.
  - Add prefixes or suffixes to filenames for better organization.

- **Image Editing**:
  - Resize images with exact dimensions, maximum bounds, or fixed aspect ratios.
  - Adjust image quality and apply sharpening settings.

- **Individual Image Editing**:
  - Edit individual images to override variant settings.
  - Crop images with zoom and position adjustments.

- **Desktop-Like File Explorer**:
  - Sort images by filename, variant, or file size.
  - Quickly identify large files for separate adjustments.

- **Batch Export**:
  - Download all processed images as a ZIP file.

## Key Libraries Used
- **`react`** for building the user interface
- **`pica`** for image processing
- **`jszip`** for exporting images as a ZIP file
- **`zustand`** for state management
- **`styled-components`** for styling

## How to Run

1. Clone the repository:
   ```
   git clone https://github.com/arekdurlik/batch-image-resize.git
   ```

3. Install the dependencies:
   ```
   npm install
   ```

5. To start the development server, run:
   ```
   npm run dev
   ```
