# About Project
* This is a base nodejs project template, which anyone can use as it has been prepared by keeping some of the most important code principles and project management recommendations. Feel free to change anything.

# Project Setup
* Download this template and open in any editor.
* install the packages required for this project - 
    ```
    npm i 
    ```
* In the root directory create a `.env` file and add the following env variables.
    ```
    PORT = <port number of your choice>
    ```
    ex:
    ```
    PORT = 3000
    ```
* Go inside the `src` folder and execute the following command - 
    ```
    npx sequelize init
    ```
* By executing the above command yo uwill get `migrations` and `seeders` folders along with a `config.json` inside the `config` foder.
* To run the server execute - 
    ```
    npm run dev
    ```