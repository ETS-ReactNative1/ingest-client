import React, { Component } from 'react';
import Select from "react-select";

export default class MySelect extends React.Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values[this.props.field]
    this.props.onChange(this.props.field, value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched[this.props.field]
    this.props.onBlur(this.props.field, true);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.isHorizontal ? (
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">{this.props.label}</label>
            </div>
            <div className="field-body">
              <div className="field">
                <Select
                  options={this.props.options}
                  isMulti={this.props.isMulti}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={this.props.value}
                  styles={{
                    control: (provided, { isFocused }) => {
                      return {
                        ...provided,
                        '&:hover': { borderColor: !!this.props.error && this.props.touched ? 'red' : '#b5b5b5' },
                        borderColor: !!this.props.error && this.props.touched ? 'red' : '#dbdbdb',
                        boxShadow: !!this.props.error && this.props.touched && isFocused ? '0 0 0 0.125em rgba(255, 56, 96, 0.25)' : provided.boxShadow
                      }
                    }
                  }}
                />
                {!!this.props.error && this.props.touched ? (
                  <p className="help is-danger">{this.props.error}</p>
                ) : (
                  <p className="help">{this.props.tip}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="field">
            <label className="label">{this.props.label}</label>
            <Select
              options={this.props.options}
              isMulti={this.props.isMulti}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={this.props.value}
              styles={{
                control: (provided, { isFocused }) => {
                  return {
                    ...provided,
                    '&:hover': { borderColor: !!this.props.error && this.props.touched ? 'red' : '#b5b5b5' },
                    borderColor: !!this.props.error && this.props.touched ? 'red' : '#dbdbdb',
                    boxShadow: !!this.props.error && this.props.touched && isFocused ? '0 0 0 0.125em rgba(255, 56, 96, 0.25)' : provided.boxShadow
                  }
                }
              }}
            />
            {!!this.props.error && this.props.touched && (
              <p className="help is-danger">{this.props.error}</p>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}
