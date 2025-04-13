# Modern Image Gallery

A beautiful and responsive image gallery built with Next.js, TypeScript, and Material UI. This application allows users to upload images to Cloudinary, view them in a responsive grid, open image previews, and delete images.

## Features

- Responsive image gallery with grid layout
- Upload single/multiple images with drag-and-drop functionality
- Cloudinary integration for image storage
- Image preview modal for larger view
- Delete functionality with confirmation dialog
- Infinite scroll for image loading
- Search functionality to filter images by title or tags
- Beautiful and modern UI with Material UI

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/image-gallery.git
cd image-gallery
```

2. Install the dependencies
```bash
npm install
# or
yarn install
```

3. Configure Cloudinary

Update the `.env` file with your Cloudinary credentials:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You need to:
- Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
- Get your Cloud Name from the Cloudinary dashboard
- Create an unsigned upload preset in the Settings > Upload section
- Add your API Key and API Secret from the dashboard

### Running the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/app
├── /api           # API routes
│   └── /delete-image  # Image deletion API
├── /components    # React components
├── /hooks         # Custom React hooks
├── /types         # TypeScript type definitions
├── /utils         # Utility functions and configurations
├── layout.tsx     # Root layout component
└── page.tsx       # Home page component
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Material UI](https://mui.com/) - UI components
- [Cloudinary](https://cloudinary.com/) - Image storage and manipulation
- [Axios](https://axios-http.com/) - HTTP client

## License

This project is licensed under the MIT License
# image-upload-gallery
