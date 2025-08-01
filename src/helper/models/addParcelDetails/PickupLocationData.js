class PickupLocationData {
  constructor(
    coordinate,
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
    sending,
    parcel_value,
    weight,
    dimensions,
    width,
    height,
    pickup_date_time,
    comment,
    e_challan
  ) {
    this.coordinate=coordinate;
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
    this.sending = sending;
    this.parcel_value = parcel_value;
    this.weight = weight;
    this.dimensions = dimensions;
    this.width = width;
    this.height = height;
    this.pickup_date_time = pickup_date_time;
    this.comment = comment;
    this.e_challan = e_challan;
  }
}

export default PickupLocationData;
