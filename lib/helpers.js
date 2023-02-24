import GeoViewport from "@mapbox/geo-viewport";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const isMarker = (child) =>
  child &&
  child.props &&
  child.props.coordinate &&
  child.props.cluster !== false;

export const calculateBBox = (region) => {
  let lngD;
  if (region.longitudeDelta < 0) lngD = region.longitudeDelta + 360;
  else lngD = region.longitudeDelta;

  return [
    region.longitude - lngD, // westLng - min lng
    region.latitude - region.latitudeDelta, // southLat - min lat
    region.longitude + lngD, // eastLng - max lng
    region.latitude + region.latitudeDelta, // northLat - max lat
  ];
};

export const returnMapZoom = (region, bBox, minZoom) => {
  const viewport =
    region.longitudeDelta >= 40
      ? { zoom: minZoom }
      : GeoViewport.viewport(bBox, [width, height]);

  return viewport.zoom;
};

export const markerToGeoJSONFeature = (marker, index) => {
  return {
    type: "Feature",
    geometry: {
      coordinates: [
        marker.props.coordinate.longitude,
        marker.props.coordinate.latitude,
      ],
      type: "Point",
    },
    properties: {
      point_count: 0,
      index,
      ..._removeChildrenFromProps(marker.props),
    },
  };
};

export const generateSpiral = (marker, clusterChildren, markers, index) => {
  const { properties, geometry } = marker;
  const count = properties.point_count;
  const centerLocation = geometry.coordinates;

  let res = [];
  let angle = 0;
  let start = 0;

  for (let i = 0; i < index; i++) {
    start += markers[i].properties.point_count || 0;
  }

  for (let i = 0; i < count; i++) {
    angle = 0.25 * (i * 0.5);
    let latitude = centerLocation[1] + 0.0002 * angle * Math.cos(angle);
    let longitude = centerLocation[0] + 0.0002 * angle * Math.sin(angle);

    if (clusterChildren[i + start]) {
      res.push({
        index: clusterChildren[i + start].properties.index,
        longitude,
        latitude,
        centerPoint: {
          latitude: centerLocation[1],
          longitude: centerLocation[0],
        },
      });
    }
  }

  return res;
};

export const Colorscalef = (pmvalue) => {

  const items = [
    {pmvalue:4, color: Colorscale.green1},
    {pmvalue:7, color: Colorscale.green2},
    {pmvalue:10, color: Colorscale.green3},
    {pmvalue:15, color: Colorscale.yellow1},
    {pmvalue:24, color: Colorscale.yellow2},
    {pmvalue:35, color: Colorscale.yellow3},
    {pmvalue:50, color: Colorscale.orange1},
    {pmvalue:90, color: Colorscale.orange2},
    {pmvalue:150, color: Colorscale.red1},
    {pmvalue:180, color: Colorscale.red2},
    {pmvalue:250, color: Colorscale.red3},
    {pmvalue:800, color: Colorscale.purple1},
    {pmvalue:100000, color: Colorscale.gray},
  ]
  const item = items.find((item) => pmvalue < item.pmvalue)
  return item.color;
}

const Colorscale = {
  green1:"#B0D8A4",
  green2: "#DDDD99",
  green3: "#E8DE96",
  yellow1: "#FEE191",
  yellow2: "#FEC482",
  yellow3: "#FEB078",
  orange1: "#FD8F67",
  orange2: "#F8705E",
  red1: "#EE545A",
  red2: "#EA4759",
  purple1: "CF578E",
  purple2: "AF72D3",
  gray: "#A6A6A6"
}

export const returnMarkerStyle = (points) => {
  if (points >= 50) {
    return {
      width: 84,
      height: 84,
      size: 64,
      fontSize: 20,
    };
  }

  if (points >= 25) {
    return {
      width: 78,
      height: 78,
      size: 58,
      fontSize: 19,
    };
  }

  if (points >= 15) {
    return {
      width: 72,
      height: 72,
      size: 54,
      fontSize: 18,
    };
  }

  if (points >= 10) {
    return {
      width: 66,
      height: 66,
      size: 50,
      fontSize: 17,
    };
  }

  if (points >= 8) {
    return {
      width: 60,
      height: 60,
      size: 46,
      fontSize: 17,
    };
  }

  if (points >= 4) {
    return {
      width: 54,
      height: 54,
      size: 40,
      fontSize: 16,
    };
  }

  return {
    width: 48,
    height: 48,
    size: 36,
    fontSize: 15,
  };
};

const _removeChildrenFromProps = (props) => {
  const newProps = {};
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      newProps[key] = props[key];
    }
  });
  return newProps;
};
