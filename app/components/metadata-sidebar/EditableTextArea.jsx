var React = require('react');
var ReactDOM = require('react-dom');
var {connect} = require('react-redux');
var Utils = require('Utils');

var EditableTextArea = React.createClass({
  getInitialState: function() {
    return {
      editing: false,
      fieldName: this.props.fieldName,
      fieldValue: this.props.fieldValue,
      fieldType: this.props.type !== undefined ? this.props.type : 'string',
      labelPrefix: this.props.labelPrefix
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      fieldValue: nextProps.fieldValue
    });
  },
  componentDidUpdate: function() {
    if(this.state.editing) {
      var $textareas = $(ReactDOM.findDOMNode(this.refs.textArea));
      var currentTextArea = $textareas[0];
      currentTextArea.style.height = currentTextArea.scrollHeight + 'px';
      currentTextArea.style.overflowY = 'hidden';
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.fieldValue !== nextProps.fieldValue ||
           this.state.fieldValue !== nextState.fieldValue ||
           this.state.editing !== nextState.editing;
  },
  labelClicked: function() {
    this.setState({ editing: true });
  },
  textChanged: function() {
    // dynamically adjust the height of the text area based on content that is entered
    var textArea = this.refs.textArea;
    var updatedValue = textArea.value;
    // check the field type to determine which field values need to be integers
    if(this.state.fieldType == 'integer') {
      // convert field value to integer
      updatedValue = parseInt(updatedValue);
      // set the field value to 0 for non-valid and negative numbers
      if(isNaN(updatedValue) || updatedValue < 0) {
        updatedValue = 0;
      }
    }
    this.setState({ fieldValue: updatedValue });
    textArea.style.height = textArea.scrollHeight + 'px';
  },
  inputLostFocus: function() {
    this.setState({ editing: false });
    // send the key and value of the text area to the update handler callback method
    this.props.updateHandler(this.state.fieldName, this.state.fieldValue);
  },
  keyPressed: function(event) {
    if(event.key == 'Enter') {
      this.inputLostFocus();
    }
  },
  handleFocus: function(e) {
    var target = e.target;
    setTimeout(function() {
      target.select();
    }, 0);
  },
  render: function() {
    if(this.state.editing) {
      return (
        <div className={this.props.classNames}>
          <textarea ref='textArea'
                    onChange={this.textChanged}
                    onBlur={this.inputLostFocus}
                    onKeyPress={this.keyPressed}
                    defaultValue={this.state.fieldValue}
                    onFocus={this.handleFocus}
                    autoFocus>
         </textarea>
       </div>
      );
    }
    return (
      <div className={this.props.classNames} onClick={this.labelClicked}>
        {this.state.labelPrefix} <i className="fa fa-pencil-square-o"></i> {Utils.getLocalizedPropertyValue(this.state.fieldValue)}
      </div>
    );
  }
});

module.exports = connect()(EditableTextArea);
