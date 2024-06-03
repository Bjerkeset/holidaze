# Holidaze

An accomidation applcation project for the Noroff year 2 Exam front-end development studies.

## Resources

- [Live site](https://holidaze-mu.vercel.app/) - Visit holidaze deployed at Vercel
- [Figma](https://www.figma.com/design/vJoVUteCMBNhQjA3VUm5bl/Holidaze?node-id=0-1) - UX/UI Design template
- [Gantt](https://drive.google.com/file/d/1cq8nENckSwzbKHJkTZDk05MBO8jEp8lh/view?usp=sharing) - Planning Gantt Chart
- [Report](https://docs.google.com/document/d/12utluuBP4DqwpdL2kILTiv2gtPLgS7WXXyO6AOgMfZ0/edit?usp=sharing) - Project Report

## Getting Started

First, run the development server:

```bash
npm i
# then
npm run dev
```

To test all feature you must add a google maps api key to `.env`.

Then open [http://localhost:3000](http://localhost:3000) with your browser

## Features

### Tech stack

- [Nextjs 14.2 ](https://nextjs.org/docs) - Modern full-stack web development framework.
- [Typescipt](https://www.typescriptlang.org/) - Typed superset of JavaScript that compiles to plain JavaScript.
- [Google maps](https://developers.google.com/maps/documentation) - Provides geographical data and mapping capabilities.
- [Trading View](https://tradingview.github.io/lightweight-charts/) - Financial visualization tool.
- [Luxor](https://moment.github.io/luxon/#/?id=luxon) - Library for working with dates and times.
- [Shadcn](https://ui.shadcn.com/) - Collection of modern and reusable React components.
- [React Hook Form](https://react-hook-form.com/) - Performant and flexible forms with easy-to-use validation.
- [Zod](https://zod.dev/) - TypeScript-first schema declaration and validation library.
- [Sonner](https://sonner.emilkowal.ski/) - Simple toast notifications for React applications.

### User-facing Features

- View a list of venues
- Search venues within a location
- View venue details
- View availability calendar
- Register and login as a customer or venue mananger
- Book a venue
- Create a venue as a mananger
- View upcoming bookings
- Filter venues by popularity.
- View sales statistics on a dashboard

---

## About the Project

### Introduction

Holidaze is an accommodation booking platform designed so that users can easily book their holiday, and for the venue managers to have a clear overview of their bookings and venues. The application is designed with a modern user interface and user experience in mind. This project, spanning over eight weeks, served as a capstone to demonstrate the skills and knowledge acquired over a two-year front-end development curriculum.

### Summary

The application is built with modern web development principles, emphasizing a minimalistic and mobile-first design approach. The visual design focuses on readability and accessibility, using ample white space, a neutral color palette, and consistent typography. The user interface adapts to both mobile and desktop devices, ensuring optimal usability across all platforms. User experience is prioritized by minimizing the number of clicks required for common actions and enhancing user feedback through alerts, popups, and toasts.

Development was centered around React functional components and Next.js server components, allowing for efficient data fetching and manipulation. The integration with the Noroff API posed some challenges, particularly in sorting and filtering data by location, which required creative workarounds.

Key features include an interactive map using the Google Maps API, a comprehensive dashboard with sales statistics and booking management, and profile pages where users can view and search through listings. The TradingView financial chart API was used to visualize sales data effectively.

Overall, the Holidaze project successfully demonstrates the practical application of web development skills, highlighting the importance of planning, design, and iterative development in creating a user-centric application.

#### Visual Design

The application employs a minimalistic approach with ample white space and a neutral color palette, enhancing readability and ensuring accessibility compliance. Consistent typography and iconography establish a cohesive visual identity. The neutral design aligns with the site's theme, making it familiar and easy to navigate for a wide range of users. The design prioritizes mobile users, as the majority of traffic is anticipated to come from mobile devices.

**User Interface (UI)**

Certain features are adapted for mobile and desktop sizes. The main differences include a bottom navigation bar for mobile users and a top navigation bar for desktop users. Additionally, action dialogs are implemented as drawers on mobile and regular dialog boxes on desktop, ensuring optimal usability across devices.

**User Experience (UX)**

The user experience is designed to be straightforward and efficient. Customers can easily book accommodations, and venue managers can manage listings and bookings with minimal effort. The number of clicks required for common actions is minimized, and user feedback is enhanced through the use of alerts, popups, toasts, loading button variants, and input messages.

#### Development

The development principles for Holidaze revolve around the use of React functional components. The site structure is divided into pages, leveraging Next.js server components to make the root page asynchronous, enabling efficient data fetching and manipulation from the backend API. Data is passed down to each child component from the page root, ensuring an efficient and organized data structure.

**API Integration**

We use Next.js server actions to create fetch functions that interact with the Noroff API. Each fetch function acts as its own server, interacting directly with the Noroff server. This approach results in a faster and more scalable site. The fetch functions share a similar structure, returning predefined objects, which makes front-end function calls shorter, predictable, and easier error handling.

**Homepage**

Upon visiting the site, the user is greeted with a map centered on Europe. This map is created using the Google Maps API in conjunction with the location data from the backend API. By combining these two data sources, we can create an interactive map populated with markers for each venue with valid coordinates.

Initially, I opted to use the Mapbox API for the map component. However, after numerous attempts, I found it challenging to style and difficult to work with due to the documentation. Therefore, I switched to the Google Maps API, which proved to be marginally better and more suitable for the required features.

The final implementation displays a comprehensive list of all venues in Europe and includes the ability to search for specific venues. Users can also filter for all venues and popular venues. These filters differ from the Europe-specific search as the location-based filter is a workaround and does not support pagination. This limitation arises because the API does not allow sorting based on coordinates.

By using the Google Maps API, we achieved a functional and visually appealing map interface that enhances the user experience by providing an intuitive way to explore available venues.

**Dashboard**

A registered venue manager can access the dashboard. At the root level of the dashboard, we fetch all relevant sales information for the user and manipulate the data using various utility functions to display an overview of sales and user statistics. These statistics include overall weekly sales and a chart showcasing all sales (in USD) over time. The chart is rendered using the TradingView financial chart API, which proved to be a surprisingly easy-to-use data visualization tool.

Additionally, the user can view a list of incoming and outgoing bookings, with the latter being particularly relevant for venue purchasers. This comprehensive dashboard allows venue managers to have a clear and detailed view of their sales performance and booking status.

The dashboard is designed to provide essential insights and analytics at a glance, ensuring that venue managers have all the necessary information to optimize their operations.

**Profile**

Each user has their own profile card displayed on the profile page, which is viewable by other registered users. On this page, users can view all the listings associated with the profile and search through them. This feature enhances the community aspect of the platform, allowing users to easily explore and connect with each other’s listings.

**Challenges and Workarounds**

The API, developed by an external team, presented some limitations for the site’s features. Early on, I decided to display venues based on coordinates. However, the API had limitations in sorting and filtering capabilities, requiring me to implement workarounds for filtering venues based on location. For more details, refer to the fetchAllVenuesInEurope function.

### Conclusion

Holidaze is a comprehensive accommodation booking application that showcases the skills and knowledge acquired over two years of study. The project was a valuable learning experience, highlighting the importance of planning, design, and iterative development.
