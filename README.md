# real time trading dashboard

### ✨ Introduction
This dashboard allows you to view the latest prices of top cryptocurrencies in real time, along with their historical performance.

### 🏛️ App architecture
This is the overall architecture of the application
```sh
+-------------------------+      HTTP/WS       +-----------------------------------------------------------+
|  React Frontend         | <----------------> |  Golang Backend                                           |
|-------------------------|                    |-----------------------------------------------------------|
| Login Screen            |                    | /tickers/get                                              |
| Dashboard Screen        |                    | /history/get                                              |
| Zustand Store           |                    | /ws/tickers/get (Websocket server for our client app)     |
| Websocket connection    |                    | StartLiveTickerConnection() (Websocket to Binance apis)   |
+-------------------------+                    +-----------------------------------------------------------+
            |                                                                           |
            |-------------------------- GET /tickers/get ------------------------------>|
            |-------------------------- WS ws/tickers/get ----------------------------->|
            | (These both are fired instantly as soon as our Dashboard screen loads)    |---> Establish connection with Binance
            |                                                                           |
            |<------------------- JSON response for /tickers/get ---------------------- |
            |                                                                           |
            |<------------------- WebSocket Connection establish ---------------------- |
            |<------------------------ Push ticker updates ---------------------------- |
            | These updates are consumed by our app and data is displayed on the Tickers|
            | and on the graphs                                                         |
```

### 🌠 Functionalities & features
* All the core functionalities mentioned in the [doc](https://docs.google.com/document/d/1mNBtw1ZysGXDDLXAPRW8iRYfnG-erCN9fRPRI1GqjIk/edit?tab=t.0#heading=h.3vfmcgvtpx3w) are implemented in this project.
* You can open the dashboard, if you are not logged in, you are welcomed by the Login screen. Upon clicking login button (mocked), you are redirected to main dashboard screen on which on the top there is app Header, then below that, list of Tickers (6 for now) are shown. First they are static and then upon the successful establishment of the websocket connection, live tickers price are shown for the Tickers. Simultaenously, for the static Ticker response (/tickers), by default first ticker is selected and its corresponding 1D data is opened in the chart below. As soon as the previously opened websocket connection becomes active, this chart also becomes live. 1D data is fitted with live data, whereas 5D data is not real-time, but it fetches and shows the latest closing price at that instant, when 5D graph was opened.
* You can view the available Tickers, as soon as the Dashboard screen loads.
* By default 1st Ticker's data is loaded in the graph. 1D graph shows real-time live data (latest price is also reflected on the graph in real-time) and 5D graph data is also fetches the latest data at that instant.
* You can view the data in line format as well as in candlestick format.
* You can zoom, interact with the graph as your wish to view the respective data.
* There are 2 http api and 1 ws api:
    * `/tickers/get` -> fetches the available Tickers (static list).
    * `/history/get` -> fetches the historical data for a ticker with specified period (1D/5D etc) and limit of data points.
    * `ws/ticker/get` -> this starts a webocket connection between our frontend and backend client and it steams the latest ticker price fetched from the Binance ticker websocket connection.
* This project is fully typed (Typescript) use.
* Production grade practices(coding conventions, folder structures, FE/BE arch) for `frontend` and as well as `backend` directories are used.
* No mocked financial data is used, real data coming from Binance apis is shown on our dashboard.
* This app follows mobile first design approach for UI.
* The app is responsive.
* `useState` (for local) and `Zustand` (for global) state is used at appropriate places.
* User auth state is stored in the `localStorage` and whenever the app reloads, it extracts the value from there, stores in the global Zustand state, and from there it is served in the app.
* I have also added basic test cases in `mapper`, `store`, `service` and `controller` layers.

### 🌟 Bonus features
* Login authentication (mocked)
* Dockerize the whole application

### 🛞 Trade-offs/Assumptions
* I haven’t used polling anywhere in this project because it doesn’t fit the use case for real-time updates. Instead, I have used:

1. A WebSocket connection between my frontend client and backend server.
2. A WebSocket connection between my backend server and Binance's server.

* However, there’s no need for bidirectional communication in either case. From the backend to Binance or from the frontend to the backend, we could have used SSE (Server-Sent events) instead of these WebSocket connections. But due to time constraints, api availability and Websockets as mentioned in requirements for the challenge, I decided to move ahead with Websockets for real-time communication.

### 🛠️ Tech stack and libraries
* I have used the following tech stack
1. **Frontend**: React.JS (`react`) is used and packages like `react-router-dom`, `zustand`, `react-apexcharts`, `tailwind`, `react-icons` etc are also used. Please visit [`package.json`](https://github.com/daxter-army/real-time-trading-dashboard/blob/main/frontend/package.json) for full list.
2. **Backend**: It is built with Golang and uses 2 external packages: `github.com/gorilla/websocket` and `github.com/joho/godotenv`. Please visit [`go.mod`](https://github.com/daxter-army/real-time-trading-dashboard/blob/main/backend/go.mod) for full list.

### 🔨 Project structure
1. `backend` directory strcuture is like this:
```sh
backend/
├── controller/
├── domain/
├── mapper/
├── responses/
├── service/
├── store/
├── utils/
├── vendor/
├── .sample.env
├── go.mod
└── go.sum
```

2. `frontend` directory structure is like this:
```sh
frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── screens/
│   ├── store/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── ...and other setup files
```

### ⚡️ How to run this project locally?
#### 🐳 With `docker`
##### 📋 Prerequisite
For this step docker should be installed on your machine. I have prepared this at docker version `29.3.0`
##### 💻 Local setup
1. Open terminal at project's base dir, and then hit `docker compose up --build`
2. Open browser and navigate to `http://localhost:3000`, the app should be there to welcome you 🎉.

#### 🐳 Without `docker`
##### 📋 Prerequisite
For this step Node.js `20.X` and golang `1.25` should be installed on your machine.
##### 💻 Local setup
1. Fork `git@github.com:daxter-army/real-time-trading-dashboard.git` in your machine.
2. Open terminal 1 at `/backend` dir and terminal 2 at `/frontend` dir.
3. In `/backend`, there would be a file named `.sample.env`, rename that to `.env` (I did'nt commit `.env` because we may have to use api secret in `.env` and then it would already have been in our git history).
4. In terminal 1, hit: `go mod vendor && go mod tidy && go run main.go`
5. This will start our backend server at **port:8080**
6. In terminal 2, hit: `npm i && npm run dev`
7. This will start our frontend app's server at **port:5173**
8. Then navigate to `http://localhost:5173` and the app should be there to welcome you 🎉.