# Airhead: The London Gatwick Passenger Quiz

> Turn your gate-side wait into a high-flying competition.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

## Play on mobile
<img src="https://github.com/user-attachments/assets/06d1be12-cba2-4881-8326-126b2ed9b4f0" width="500" alt="b7nSD9">

## Demo
**[Watch the Demo on YouTube](https://youtu.be/lu9MpFOq1Lk)**

---

![gallery](https://github.com/user-attachments/assets/7824e939-2ad9-43e8-a25b-5ed01c2d24e7)
![gallery (2)](https://github.com/user-attachments/assets/2691b94e-2f93-4a9e-bebd-77866c1672ac)
![gallery (1)](https://github.com/user-attachments/assets/b22e6bdb-acf9-4e43-87c0-52ba1e211b39)
![gallery (3)](https://github.com/user-attachments/assets/34c79d75-218b-4500-91f4-be4d556a04db)


## Inspiration
While waiting at the gate in London Gatwick's North or South terminals, passengers often look for themed entertainment. Inspired by the addictive nature of **Wordle** and **2048**, we created **Airhead**—a quiz designed specifically for the Gatwick environment. 

Whether you are a first-time flyer or a seasoned traveler, Airhead offers a frictionless way to test your trivia, compete on a daily leaderboard, and kill time before boarding without the hassle of downloading a native app.

## What it does
- **Daily Quiz:** Themed on Gatwick airlines, real-time flight data, and aviation history.
- **Frictionless Entry:** No app store required. Just scan a QR code at the gate and start playing.
- **Global Leaderboard:** Compete against fellow passengers in real-time for the top spot.
- **Sustainability Focus:** Features trivia about Gatwick’s "Net Zero by 2030" goals to raise passenger awareness.
- **Incentivized Play:** Top daily scorers can win prizes like £10 vouchers for airport refreshments or flight simulator experiences.

## How we built it
- **Frontend:** Built with **Next.js** and **React** for a fast, responsive mobile-first UI.
- **Language:** Written in **TypeScript** to ensure code reliability and type safety.
- **Backend & Database:** **Supabase** handles the real-time leaderboard data and score storage.
- **Deployment:** Deployed via **Vercel** for instant updates and high availability.
- **Version Control:** Managed through **GitHub** with a collaborative team workflow.

## Challenges we ran into
- **Database Integration:** As our first time using Supabase, setting up the initial communication between the client and the database was a steep learning curve.
- **Version Control:** We navigated several complex merge conflicts in GitHub, which ultimately improved our team's communication and branch management.

## Accomplishments that we're proud of
- **Client-Side Resilience:** We optimized the app to handle poor airport Wi-Fi. The quiz runs primarily client-side, ensuring a smooth experience even if the connection drops during play.
- **Zero Friction:** Successfully creating a web-app experience that feels like a native app without requiring a login or download.

## What we learned
This project was a series of "firsts" for us. None of our team members had used **Next.js**, **Supabase**, or **Vercel** before. We emerged more confident in:
- Full-stack database communication.
- Responsive CSS and mobile-first design.
- Advanced TypeScript implementation.

## What's next for Airhead
- **AI-Generated Questions:** Integrate the **Gemini API** to convert live flight data into dynamic daily questions.
- **Live Flight Tracking:** Allow users to see their specific flight status integrated directly into the game UI.
