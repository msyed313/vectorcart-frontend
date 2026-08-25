# VectorCart Frontend — Setup Notes

## 1. Create the project (if not already done)

```bash
npm create vite@latest vectorcart-frontend -- --template react
cd vectorcart-frontend
npm install
```

## 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Replace the generated `tailwind.config.js` with the one provided here.

## 3. Install additional dependencies used in these files

```bash
npm install axios
```

(Add `react-router-dom` once you're ready to wire up real page routing —
`App.jsx` here is a minimal example without routing yet.)

## 4. File placement

Copy each file into your project at the matching path:

```
tailwind.config.js          → project root
src/index.css                → src/index.css (replace the default one)
src/App.jsx                  → src/App.jsx (replace the default one)
src/context/CompanyContext.jsx
src/api/companyApi.js
src/components/Navbar.jsx
src/components/Footer.jsx
src/pages/CompanySettings.jsx
```

Make sure `main.jsx` imports the CSS file:
```js
import "./index.css";
```

## 5. Environment variable — point the frontend at your API

Create `.env` in the project root (already covered by your `.gitignore`):
```
VITE_API_BASE_URL=https://localhost:7001/api
```
Replace `7001` with whatever port your ASP.NET Core API is actually running on
(check the terminal output or `launchSettings.json`).

## 6. CORS — required on the backend or none of this will work

Your React app (likely `http://localhost:5173`) and your API run on different
origins, so the browser will block requests unless the API explicitly allows it.
In `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```
And in the middleware pipeline (before `app.MapControllers()`):
```csharp
app.UseCors("AllowFrontend");
```

## 7. Run both projects together

```bash
# Terminal 1 — backend
dotnet run --project VectorCart.API

# Terminal 2 — frontend
npm run dev
```

Visit the frontend URL — you should see the navbar/footer pull the seeded
company name (or a placeholder gradient block if no logo is uploaded yet),
and the Company Settings form should load your seeded data and let you edit
it end-to-end, including a working logo upload.

## 8. Design system reference

See `DESIGN_SYSTEM.md` for the full color/type rationale — every component
here pulls colors from Tailwind's extended theme (`bg-primary`, `text-ink`,
etc.), never raw hex codes, so changing a token in `tailwind.config.js`
updates the whole app consistently.
