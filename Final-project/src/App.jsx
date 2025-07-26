function App() {

  return (
    <>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Ferdi Alfiansah</title>
        </head>
        
        <body>
      <div className="min-h-screen flex flex-col">
           <nav class="flex items-center justify-between px-4 py-3 shadow-md bg-white">
                {/* <!-- Logo --> */}
              <div class="text-white bg-black px-2 py-1 font-bold text-lg">SE</div>

              {/* <!-- Desktop Menu --> */}
              <div class="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <a href="#tech-stack" class="hover:text-black">Tech Stack</a>
                <a href="#experience" class="hover:text-black">Experience</a>
                <a href="#projects" class="hover:text-black">Projects</a>
                <a href="#" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Let's Talk</a>
                <a href="#" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center gap-2">
                  {/* <!-- Download Icon --> */}
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M5 20h14v-2H5v2zM12 2l-5.5 9h11L12 2z" />
                  </svg>
                  Download CV
                </a>

                {/* <!-- 🌙 Dark Mode Icon (Desktop) --> */}
                <button class="text-gray-500 hover:text-black">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                  </svg>
                </button>
              </div>

              {/* <!-- Mobile Icons --> */}
              <div class="flex md:hidden items-center gap-4">
                {/* <!-- 🌙 Dark Mode Icon (Mobile) --> */}
                <button class="text-gray-500 hover:text-black">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                  </svg>
                </button>

                {/* <!-- ☰ Hamburger --> */}
                <button onclick="toggleMenu()" class="text-gray-500 hover:text-black focus:outline-none">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
          </nav>

            {/* <!-- Mobile Menu --> */}
            <div id="mobile-menu" class="hidden md:hidden px-4 py-3 space-y-2 shadow bg-white">
              <a href="#tech-stack" class="block text-gray-600 hover:text-black">Tech Stack</a>
              <a href="#experience" class="block text-gray-600 hover:text-black">Experience</a>
              <a href="#projects" class="block text-gray-600 hover:text-black">Projects</a>
              <a href="#" class="block bg-green-500 text-white px-4 py-2 rounded text-center">Let's Talk</a>
              <a href="#" class="block bg-black text-white px-4 py-2 rounded text-center">Download CV</a>
            </div>
            
       </div>
        </body>
      </html>
    </>
  );
}

export default App;
