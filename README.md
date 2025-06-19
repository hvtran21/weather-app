# Weather Forecast App

A sleek React Native app that gives detailed current, hourly, and 7-day weather forecasts using Open-Meteo and reverse geocoding.

## 🚀 Features
- Local weather via GPS
- Hourly + 7-day forecasts
- Clean UI with FontAwesome icons
- Context-based state management
- Written in TypeScript + Expo

## 📦 Tech Stack
- React Native (Expo)
- Flask backend w/ Open-Meteo API
- FontAwesome icons
- Reverse geocoding (Expo Location)

## Made for 0to1Hacks Final Round
Recieved the email notifying me that I got to the final around, June 17th. Had less than 24 hours, and didn't get to do push notifications. Given the time constraints, I believe 
this is okay, and has a LOT of room for improvement. Hopefully you enjoy the simple and clean UI.

## If I had more time, what would I change?
- Add some fun facts notifications about the weather. Such as the smell of rain on dry soil, is called petrichor.
- Interact with the maps, if you have a destination to X location, give little notification of what weather to expect.
- Add a SQLite database, if use keeps opening up app consistently, doesn't have to spam the API over and over.
- Add more data in the homepage, where the user can scroll down and find information such as precipitation amounts, current elevation, sunrise/sunset time, etc.

## 🔧 Setup
```bash
npm install
npx expo start
