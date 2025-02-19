# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh






to run frontend development server use 'npm run dev'
backend server use ' uvicorn main:app --reload'
this one is to use the streamlit app as a backend server.

' uvicorn main:app --reload' this should open swagger api docs interface. validate the api's working and let me know what additions can be made to the frontend.


uvicorn main:app --reload --host 0.0.0.0 --port 8000  

venv\Scripts\activate

$ curl -X POST "http://127.0.0.1:8000/analyze" -H "Content-Type: multipart/form-data" -F "contractType=Loan Agreement" -F "contracts=@/C/Users/kiran/Downloads/HDFC-Bank-Home-Loan-Agreement.pdf"

