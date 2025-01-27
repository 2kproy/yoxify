// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Наши страницы
// import Login from './pages/Login';
// import Register from './pages/Register';
// import MainApp from './pages/MainApp';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Страница логина */}
//         <Route path="/login" element={<Login />} />

//         {/* Страница регистрации */}
//         <Route path="/register" element={<Register />} />

//         {/* Основной layout приложения (список серверов, чаты и т.д.) */}
//         <Route path="/*" element={<MainApp />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импортируем наши страницы
import Login from './pages/Login';
import Register from './pages/Register';
import MainApp from './pages/MainApp';
import ServerPage from './pages/ServerPage';
import ChannelPage from './pages/ChannelPage';

// Импортируем RequireAuth
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Пример защищённого маршрута. Основной layout приложения (список серверов, чаты и т.д.)*/}
        <Route 
          path="/*"  // «*» означает, что внутренняя навигация тоже обрабатывается (например, /server/:id)
          element={
            <RequireAuth>
              <MainApp />
            </RequireAuth>
          } 
        >
          {/* Вложенные маршруты */}
          <Route path="servers/:serverId" element={<ServerPage />}>
            <Route path="channel/:channelId" element={<ChannelPage />} />
          </Route>
          
        </Route>
      </Routes>
    </Router>
  );
}


export default App;