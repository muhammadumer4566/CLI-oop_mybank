#! /usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
class Customer {
    firstName;
    lastName;
    age;
    gender;
    phoneNum;
    accountNum;
    constructor(fName, lName, age, gender, phoneNum, accountNum) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.phoneNum = phoneNum;
        this.accountNum = accountNum;
    }
}
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccount(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        this.account.filter((acc) => acc.accountNum !== accObj.accountNum);
    }
}
const HBL = new Bank();
for (let i = 1; i <= 5; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.string.numeric("3#########"));
    const customer = new Customer(fName, lName, 20 * i, "male", num, 1000 + i);
    HBL.addCustomer(customer);
    HBL.addAccount({ accountNum: customer.accountNum, balance: 100 * i });
}
async function bankServices(bank) {
    do {
        let ans = await inquirer.prompt([
            {
                name: "select",
                type: "list",
                message: "Please Select the Service",
                choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
            },
        ]);
        if (ans.select === "View Balance") {
            let res = await inquirer.prompt([
                {
                    name: "num",
                    type: "input",
                    message: "Please enter your account number",
                },
            ]);
            let account = HBL.account.find((acc) => acc.accountNum == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let name = HBL.customer.find((item) => item.accountNum == account?.accountNum);
                console.log(`Dear ${chalk.green.bold(name?.firstName)} ${chalk.green.bold(name?.lastName)} your account balance is ${chalk.blueBright.bold(`$${account.balance}`)}`);
            }
        }
        if (ans.select === "Cash Withdraw") {
            let res = await inquirer.prompt([
                {
                    name: "num",
                    type: "input",
                    message: "Please enter your account number",
                },
            ]);
            let account = HBL.account.find((acc) => acc.accountNum == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt([
                    {
                        name: "rupees",
                        type: "number",
                        message: "Please enter your amount",
                    },
                ]);
                if (ans.rupees <= account.balance) {
                    let newBalance = account.balance - ans.rupees;
                    bank.transaction({
                        accountNum: account.accountNum,
                        balance: newBalance,
                    });
                    console.log(chalk.green.bold("Your Cash Withdraw is Successfully Completed"));
                    console.log(chalk.green.bold(`Your remainning account balance is $${newBalance}`));
                }
                else {
                    console.log(chalk.red.bold("Insufficient Balance"));
                }
            }
        }
        if (ans.select === "Cash Deposit") {
            let res = await inquirer.prompt([
                {
                    name: "num",
                    type: "input",
                    message: "Please enter your account number",
                },
            ]);
            let account = HBL.account.find((acc) => acc.accountNum == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt([
                    {
                        name: "rupees",
                        type: "number",
                        message: "Please enter your amount",
                    },
                ]);
                let newBalance = account.balance + ans.rupees;
                bank.transaction({
                    accountNum: account.accountNum,
                    balance: newBalance,
                });
                console.log(chalk.green.bold("Your Cash Deposit is Successfully Completed"));
                console.log(chalk.green.bold(`Your new balance is $${newBalance}`));
            }
        }
        if (ans.select === "Exit") {
            process.exit();
        }
    } while (true);
}
bankServices(HBL);
