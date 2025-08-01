class DropLocationData {
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
    notify,
    insurance,
    end_trip_otp = false
  ) {
    this.coordinate = coordinate;
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
    this.notify = notify;
    this.insurance = insurance;
    this.end_trip_otp = end_trip_otp
  }
}

export default DropLocationData;
