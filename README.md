# Condominium Project.

This is my project for the class **CCMP-606 Integrated Services Using Smart Contracts**. The project is set up for ganache environment, so in order to use it just git clone the repo and follow the guide steps.

## Guide Set Up.

1. Installing openzeppelin for the `/smart-contract` folder.

```bash
cd smart-contract

npm install @openzeppelin/contracts@5.0.2
```
Note: The version for openzeppelin is a must in order to successfully compile the contract.

2. Open your Ganache and create a `NEW WORKSPACE`. named it whatever you want as long as when you `ADD PROJECT` direct it to the `truffle-config.js` file

3. Open the `truffle-config.js` file and on the `deployment` section, change the `from` tag into any address from the Ganache`s accounts. Save then:
```bash
truffle migrate
```
This will automatically compile and deploy it to the ganache network.

4. After the deploy command is complete you will see on the smart-contract folder it created the `/build` folder, open that and copy all the .json in it.

5. Go to the `/react-condo` folder and paste the copy .json in `/src/contract` folder.

6. In the terminal go to the `/react-condo` directory and do the following commands:

```bash
npm install

npm start
```

There you go, you have set up the project. Feel free to use it.
