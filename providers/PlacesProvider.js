// PlacesProvider.js
// By Ryan Owens

import Provider from './Provider';
class PlacesProvider extends Provider {
  constructor(map) {
    super();
    this.map = map;
    this.service = new google.maps.places.PlacesService(map);
  }

  search(placesString) {
    let request = {
      query: placesString
    };
    let self = this;
    return new Promise((resolve, reject) => {
      self.service.textSearch(request, (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          resolve(results[0].geometry.location);
        } else {
          reject(status);
        }
      });
    });
  }
}
export default PlacesProvider;
