'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLeafletUniversal = require('react-leaflet-universal');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var L = void 0;

var MarkerClusterGroup = function (_LayerGroup) {
  _inherits(MarkerClusterGroup, _LayerGroup);

  function MarkerClusterGroup() {
    _classCallCheck(this, MarkerClusterGroup);

    var _this = _possibleConstructorReturn(this, (MarkerClusterGroup.__proto__ || Object.getPrototypeOf(MarkerClusterGroup)).call(this));

    _this.state = { loaded: false };
    return _this;
  }

  _createClass(MarkerClusterGroup, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      L = require('leaflet');
      require('leaflet.markercluster');
      this.setState({ loaded: true }, function () {
        // Override auto created leafletElement with L.markerClusterGroup element
        _this2.leafletElement = L.markerClusterGroup(_this2.props.options);

        console.log(_this2.context);

        if (_this2.props.markers.length) {
          _this2.addLayersWithMarkersFromProps(_this2.props.markers);
        }

        _this2.props.wrapperOptions.enableDefaultStyle && (_this2.context.map._container.className += ' marker-cluster-styled');

        !_this2.props.wrapperOptions.disableDefaultAnimation && (_this2.context.map._container.className += ' marker-cluster-animated');

        // Init listeners for markerClusterGroup leafletElement only once
        _this2.initEventListeners(_this2.leafletElement);
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.markers.length && !isArraysEqual(this.props.markers, nextProps.markers)) {
        // Remove layer from map with previously rendered clustered markers
        this.layerContainer.removeLayer(this.leafletElement);
        // Remove layers with markers from markerClusterGroup
        this.leafletElement.clearLayers();

        this.addLayersWithMarkersFromProps(nextProps.markers);
      }
    }
  }, {
    key: 'removeMarkersWithSameCoordinates',
    value: function removeMarkersWithSameCoordinates(markers) {
      // init filtered markers list with first marker from list
      var filteredMarkers = [markers[0]];

      markers.forEach(function (marker) {
        if (!JSON.stringify(filteredMarkers).includes(JSON.stringify(marker))) {
          filteredMarkers.push(marker);
        }
      });

      return filteredMarkers;
    }
  }, {
    key: 'addLayersWithMarkersFromProps',
    value: function addLayersWithMarkersFromProps(markers) {
      var markersOptions = this.props.markerOptions ? Object.assign({}, this.props.markerOptions) : {};

      var filteredMarkers = this.props.wrapperOptions.removeDuplicates ? this.removeMarkersWithSameCoordinates(markers) : markers;

      var leafletMarkers = [];

      filteredMarkers.forEach(function (marker) {
        var currentMarkerOptions = marker.options ? Object.assign({}, marker.options) : null;

        var leafletMarker = L.marker([marker.lat, marker.lng], currentMarkerOptions || markersOptions);

        marker.popup && leafletMarker.bindPopup(marker.popup);
        marker.tooltip && leafletMarker.bindTooltip(marker.tooltip);

        leafletMarkers.push(leafletMarker);
      });

      // Add markers leafletElements to the markerClusterGroup
      this.leafletElement.addLayers(leafletMarkers);
      // Add clustered markers to the leaflet map
      !this.props.children && this.layerContainer.addLayer(this.leafletElement);
    }
  }, {
    key: 'initEventListeners',
    value: function initEventListeners(markerClusterGroup) {
      var _this3 = this;

      this.props.onMarkerClick && markerClusterGroup.on('click', function (marker) {
        _this3.props.onMarkerClick(marker.layer);
      });

      this.props.onClusterClick && markerClusterGroup.on('clusterclick', function (cluster) {
        _this3.props.onClusterClick(cluster.layer);
      });

      this.props.onPopupClose && markerClusterGroup.on('popupclose', function (map) {
        _this3.props.onPopupClose(map.popup);
      });
    }
  }, {
    key: 'addLayersWithReactLeafletMarkers',
    value: function addLayersWithReactLeafletMarkers() {
      var _this4 = this;

      var leafletMarkers = [];

      // Map through all react-leaflet Markers and clone them with ref prop
      // ref prop required to get leafletElement of Marker
      return _react.Children.map(this.props.children, function (reactLeafletMarker, index) {
        return (0, _react.cloneElement)(reactLeafletMarker, {
          ref: function ref(marker) {
            if (marker) {
              leafletMarkers.push(marker.leafletElement);

              if (index === _this4.props.children.length - 1 ||
              // addClusteredMarkersToMap when there is only one marker
              !Array.isArray(_this4.props.children)) {
                // Add markers leafletElements to the markerClusterGroup
                _this4.leafletElement.addLayers(leafletMarkers);
                // Add clustered markers to the leaflet map
                _this4.layerContainer.addLayer(_this4.leafletElement);
              }
            }
          },
          key: 'react-leaflet-marker-' + index
        });
      });
    }
  }, {
    key: 'getLeafletElement',
    value: function getLeafletElement() {
      return this.leafletElement;
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.loaded) {
        return null;
      }

      return this.props.children ? _react2.default.createElement(
        'section',
        { className: 'marker-cluster-group' },
        this.addLayersWithReactLeafletMarkers()
      ) : null;
    }
  }]);

  return MarkerClusterGroup;
}(_reactLeafletUniversal.LayerGroup);

exports.default = MarkerClusterGroup;


function isArraysEqual(firstArray, secondArray) {
  return JSON.stringify(firstArray) === JSON.stringify(secondArray);
}

MarkerClusterGroup.propTypes = {
  // List of markers with required lat and lng keys
  markers: _propTypes2.default.arrayOf(_propTypes2.default.object),
  // List of react-leaflet markers
  children: _propTypes2.default.node,
  // All available options for Leaflet.markercluster
  options: _propTypes2.default.object,
  // All available options for Leaflet.Marker
  markerOptions: _propTypes2.default.object,
  // Options that are supporting by react-leaflet-markercluster wrapper
  wrapperOptions: _propTypes2.default.object,
  // Events
  onMarkerClick: _propTypes2.default.func,
  onClusterClick: _propTypes2.default.func,
  onPopupClose: _propTypes2.default.func
};

MarkerClusterGroup.defaultProps = {
  markers: [],
  wrapperOptions: {}
};