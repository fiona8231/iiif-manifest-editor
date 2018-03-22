var React = require('react');
var { connect } = require('react-redux');
var MetadataPropertyObjectValue = require('MetadataPropertyObjectValue');
var DeleteMetadataPropertyButton = require('DeleteMetadataPropertyButton');
var Utils = require('Utils');

var EditableObjectMetadataPropertyCard = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.value
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if(this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  },

  renderTranslatedLanguage: function(isMultiLingual, propertyValue) {
    return isMultiLingual && propertyValue['@language'] ? ': ' + Utils.getLanguageLabelFromIsoCode(propertyValue['@language']) : '';
  },

  render: function() {
    return (
      <dl>
        <dt className="metadata-field-label">
          {this.props.label}{this.renderTranslatedLanguage(this.props.isMultiLingual, this.state.value)}
        </dt>

        <MetadataPropertyObjectValue
          fieldName={this.props.name}
          fieldValue={this.state.value}
          updateValueHandler={this.props.updateValueHandler}
        />

        {(() => {
          if(!this.props.isRequired) {
            return (
              <DeleteMetadataPropertyButton
                deleteHandler={this.props.deleteHandler}
              />
            );
          }
        })()}
      </dl>
    );
  }
});

module.exports = connect()(EditableObjectMetadataPropertyCard);