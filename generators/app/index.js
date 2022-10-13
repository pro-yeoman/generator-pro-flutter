'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const directoryTemplate = require('yeoman-directory-template');
const smartCase = require('yeoman-smart-case');
const types = require("@sap-devx/yeoman-ui-types");


module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.data = opts.data;

    this.appWizard = types.AppWizard.create(opts);
  }

  initializing() {
    this.env.adapter.promptModule.registerPrompt("crud", require("inquirer-recursive-crud")(this));
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the mind-blowing ${chalk.red('generator-pro-flutter')} generator!`
      )
    );

    let previousAnswers = this.config.get('answers');

    this.props = previousAnswers || { entities: [] };

    const answers = await this.prompt([
      {
        type: 'crud',
        name: 'entities',
        message: 'Entity',
        labelField: 'entityName',
        default: this.props.entities,
        prompts: [
          {
            type: 'input',
            name: 'moduleName',
            message: 'Module name:'
          },
          {
            type: 'input',
            name: 'entityName',
            message: 'Entity name:'
          },
          {
            type: 'crud',
            name: 'fields',
            message: 'Field',
            labelField: 'fieldName',
            default: (entity) => entity.fields,
            prompts: [
              {
                type: 'input',
                name: 'fieldName',
                message: 'Field name:',
              },
              {
                type: 'list',
                name: 'FieldType',
                message: 'Field Type (Java Class):',
                choices: ['String', 'int', 'double', 'DateTime', 'bool', 'List'],
              },
              {
                type: 'confirm',
                name: 'showInListings',
                message: 'Should the field appear in listings',
                default: true
              }
            ]
          }
        ]
      }
    ]);
    this.props.entities = answers.entities;

    this.log('Props: ' + this.props);

    this.config.set('answers', this.props);
  }

  writing() {
    const smartProps = smartCase(this.props, /^\w+Name/);
    const processedProps = { ...smartProps, _, fs: this.fs };

    directoryTemplate(this, processedProps);


  }

  install() {
    // this.installDependencies();
  }
};


