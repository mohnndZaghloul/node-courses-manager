#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import * as fs from 'node:fs';

const program = new Command();

const filePath = './courses.json';
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'What is course title ?'
    },
    {
        type: 'number',
        name: 'price',
        message: 'What is course price ?'
    },
]

program
    .name('courses')
    .description('CLI to create table for courses')
    .version('1.0.0');

program
    .command('add')
    .alias('a')
    .description('adding course to the table')
    .action(() => {
        inquirer
            .prompt(questions)
            .then((answers) => {
                answers.title = answers.title.trim();
                if(fs.existsSync(filePath)){
                    fs.readFile(filePath, 'utf-8', (err, content) => {
                        if(err) {
                            console.log('Error :',err);
                            process.exit();
                        }
                        const courses = JSON.parse(content);
                        courses.push(answers);
                        fs.writeFile(filePath, JSON.stringify(courses), 'utf-8', () => {
                            console.log('adding course is done..');
                        })
                    });
                }else {
                    fs.writeFile(filePath, JSON.stringify([answers]), 'utf-8', () => {
                        console.log('adding course is done..');
                    })
                }
            })
    })

program
    .command('remove')
    .alias('r')
    .description('removing course from the table')
    .action(() => {
        inquirer
            .prompt(questions[0])
            .then((answers) => {
                if(fs.existsSync(filePath)){
                    fs.readFile(filePath, 'utf-8', (err, content) => {
                        if(err) {
                            console.log('Error :',err);
                            process.exit();
                        }
                        const courses = JSON.parse(content);
                        const newCourse = courses.filter((course) => course.title !== answers.title);
                        if(JSON.stringify(courses) == JSON.stringify(newCourse)) {
                            console.log('there is no course with this name...');
                        }else {
                            fs.writeFile(filePath, JSON.stringify(newCourse), 'utf-8', () => {
                                console.log('removing course successfuly..');
                            })
                        }
                    });
                }else {
                    console.log('there is not courses yet...');
                    process.exit();
                }
            })
    })

program
    .command('list')
    .alias('l')
    .description('show all courses in table')
    .action(() => {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if(err) {
                console.log('Error :',err);
                process.exit();
            }
            console.table(JSON.parse(content));
        });
    })

program.parse();
