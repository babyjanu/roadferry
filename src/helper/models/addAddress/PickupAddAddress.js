class PickupAddAddress {
  constructor(
    coordinates,
    id,
    first_name,
    last_name,
    email,
    phone_number,
    flat_name,
    area,
    city,
    state,
    country,
    pincode,
  ) {
    this.coordinates = coordinates
    this.id = id
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.phone_number = phone_number;
    this.flat_name = flat_name;
    this.area = area;
    this.city = city;
    this.state = state;
    this.country = country;
    this.pincode = pincode;
  }
}

export default PickupAddAddress;
