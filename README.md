# Draw-Img

Draw-Img is a feature-rich web application designed to facilitate image editing and drawing with a focus on simplicity and accessibility. This project leverages React, TypeScript, and Tailwind CSS to deliver an interactive user experience. It integrates modern tools such as Cloudinary for image storage and TanStack React Query for state management.

---

[![Visit Draw-Img](https://img.shields.io/badge/Visit_Draw--Img-blue?style=for-the-badge)](https://draw-img.vercel.app/)

---

## Features

- **Drawing Canvas**: Use `react-canvas-draw` to draw and edit images dynamically.
- **Image Upload**: Upload images locally or directly to Cloudinary.
- **Image Comparison**: Compare images side by side using an interactive slider.
- **Progressive Loading**: Utilize Radix UI components for enhanced user experience.
- **Form Validation**: Powered by React Hook Form with Zod schema validation.
- **QR Code Generator**: Create QR codes seamlessly.
- **Dark Mode**: Supports dark/light themes with `next-themes`.
- **Responsive Design**: Tailwind CSS ensures a mobile-friendly interface.
- **State Management**: Zustand handles global state efficiently.

---

![Image 1](https://res.cloudinary.com/sutharjay/image/upload/v1734040484/draw-img/readme/uscybaiypmlduiaotscx.png)

![Image 2](https://res.cloudinary.com/sutharjay/image/upload/v1734040485/draw-img/readme/vpvhpvbcrhqtnsoejxfh.png)

![Image 3](https://res.cloudinary.com/sutharjay/image/upload/v1734040484/draw-img/readme/btuissgfm7kjh9uobomn.png)

![Image 4](https://res.cloudinary.com/sutharjay/image/upload/v1734040484/draw-img/readme/vpdfh0z8xvrr9zldzdtv.png)

![Image 5](https://res.cloudinary.com/sutharjay/image/upload/v1734040484/draw-img/readme/qyksmi9ripwupp42oirm.png)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sutharjay1/draw-img.git
   cd draw-img
   ```

2. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Access the application at `http://localhost:5173`.

---

## Directory Structure

```plaintext
C:\Users\JAY SUTHAR\root\repos\projects\draw-img
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── public
├── README.md
├── src
│   ├── app
│   ├── components
│   ├── features
│   ├── hooks
│   ├── lib
│   ├── providers
│   ├── types
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.*.json
├── vercel.json
└── vite.config.ts
```

---

## Usage

### Drawing Canvas

Navigate to the drawing canvas via the "Edit" page. Use tools like pen and eraser to create or modify images.

### Image Upload

- Drag and drop files into the upload area.
- Optionally, save files to Cloudinary by configuring your credentials in `.env`.

### QR Code Generation

Create QR codes dynamically by entering text in the "Preview" section.

---

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand, TanStack React Query
- **Utilities**: Prettier
- **Image Handling**: Cloudinary, React Dropzone,

---

## Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `pnpm dev`      | Start the development server         |
| `pnpm build`    | Build the application for production |
| `pnpm preview`  | Preview the production build locally |
| `pnpm lint`     | Run ESLint for code quality checks   |
| `pnpm lint:fix` | Automatically fix ESLint issues      |
| `pnpm format`   | Format code using Prettier           |

---

## Deployment

1. Build the project:

   ```bash
   pnpm build
   ```

2. Deploy the `dist` folder to your hosting provider or use Vercel with the included `vercel.json` configuration.

---

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## Submission Requirements

- **Documentation**: Ensure README.md is comprehensive and includes setup, usage, and contribution guidelines.
- **Functionality**: Confirm all implemented features work as expected.
- **Code Quality**: Maintain consistent formatting with Prettier and ESLint.
- **Testing**: Manually test major features before submission.

---

## Acknowledgements

Special thanks to contributors and the open-source community for the tools and libraries used in this project.
