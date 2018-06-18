const React = require('react');
const generateId = require('./services/idGenerator');
const NOOP = require('./utils/noop');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      keyChange: false
    }
  },

  getDefaultProps: function() {
    return {
      onChange: NOOP,
      options: {}
    }
  },

  componentWillMount: function() {
    const id = this.props.id;
    if (id) {
      this.id = id;
    } else {
      this.id = generateId();
    }
  },

  componentDidMount: function() {
    this.createEditor();
    this.addEvents();
    this.addExtraKeys();
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.state.keyChange && (nextProps.value !== this.simplemde.value())) {
      this.simplemde.value(nextProps.value)
    }

    this.setState({
      keyChange: false
    });
  },

  componentWillUnmount: function() {
    this.removeEvents();
  },

  createEditor: function() {
    const SimpleMDE = require('simplemde');
    const initialOptions = {
      element: document.getElementById(this.id),
      initialValue: this.props.value,
      autoSuggest: {
        mode: 'markdown',
        triggers: {
          '@': function(stringToTest) {
            return [
              { text: 'Thomas ', displayText: 'Thomas' },
              { text: 'Maria ', displayText: 'Maria' },
              { text: 'Peter ', displayText: 'Peter' },
            ];
          },
          '#': function(stringToTest) {
            return [
              { text: 'Two Sum ', displayText: 'Two Sum' },
              { text: '3Sum ', displayText: '3Sum' },
              { text: '4Sum ', displayText: '4Sum' },
            ];
          },
        },
      },
    };

    const allOptions = Object.assign({}, initialOptions, this.props.options);
    this.simplemde = new SimpleMDE(allOptions);
  },

  eventWrapper: function() {
    this.setState({
      keyChange: true
    });
    this.props.onChange(this.simplemde.value());
  },

  removeEvents: function() {
    this.editorEl.removeEventListener('keyup', this.eventWrapper);
    this.editorToolbarEl && this.editorToolbarEl.removeEventListener('click', this.eventWrapper);
  },

  addEvents: function() {
    const wrapperId = `${this.id}-wrapper`;
    const wrapperEl = document.getElementById(`${wrapperId}`);

    this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0];
    this.editorToolbarEl = wrapperEl.getElementsByClassName('editor-toolbar')[0];

    this.editorEl.addEventListener('keyup', this.eventWrapper);
    this.editorToolbarEl && this.editorToolbarEl.addEventListener('click', this.eventWrapper);
  },

  addExtraKeys: function() {
    // https://codemirror.net/doc/manual.html#option_extraKeys
    if (this.props.extraKeys) {
      this.simplemde.codemirror.setOption(
        'extraKeys',
        this.props.extraKeys
      );
    }
  },

  render: function() {
    const textarea = React.createElement('textarea', {id: this.id});
    const label = (this.props.label) ? React.createElement('label', {htmlFor: this.id}, [this.props.label]) : false;
    return React.createElement('div', {id: `${this.id}-wrapper`, className: this.props.className}, [label, textarea]);
  }
});
