import { Country, State, City } from 'country-state-city';
import axios from 'axios';

export const fetchCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data
      .map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log('Fetched countries:', countries.slice(0, 5));
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    return [
      { name: 'United States', code: 'US' },
      { name: 'India', code: 'IN' },
      { name: 'United Kingdom', code: 'GB' },
    ]; // Fallback
  }
};

export const fetchStates = async (countryCode) => {
  try {
    // Normalize country code (e.g., UK -> GB)
    const normalizedCode = countryCode === 'UK' ? 'GB' : countryCode;
    const states = State.getStatesOfCountry(normalizedCode)
      .map((state) => ({
        name: state.name,
        code: state.isoCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log(`Fetched states for ${normalizedCode}:, states.slice(0, 5)`);

    // Fallback if no states are found
    if (!states.length) {
      const fallbackStates = {
        US: [
          { name: 'California', code: 'CA' },
          { name: 'Texas', code: 'TX' },
        ],
        IN: [
          { name: 'Maharashtra', code: 'MH' },
          { name: 'Delhi', code: 'DL' },
        ],
        GB: [
          { name: 'England', code: 'ENG' },
          { name: 'Scotland', code: 'SCT' },
        ],
      };
      console.log(`Using fallback states for ${normalizedCode}:, fallbackStates[normalizedCode] || []`);
      return fallbackStates[normalizedCode] || [];
    }
    return states;
  } catch (error) {
    console.error(`Error fetching states for ${countryCode}:, error.message`);
    return [];
  }
};

export const fetchCities = async (countryCode, stateCode) => {
  try {
    const normalizedCode = countryCode === 'UK' ? 'GB' : countryCode;
    const cities = City.getCitiesOfState(normalizedCode, stateCode)
      .map((city) => ({
        name: city.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log(`Fetched cities for ${normalizedCode}/${stateCode}:, cities.slice(0, 5)`);

    // Fallback if no cities are found
    if (!cities.length) {
      const fallbackCities = {
        US: {
          CA: [{ name: 'Los Angeles' }, { name: 'San Francisco' }],
          TX: [{ name: 'Houston' }, { name: 'Austin' }],
        },
        IN: {
          MH: [{ name: 'Mumbai' }, { name: 'Pune' }],
          DL: [{ name: 'New Delhi' }],
        },
        GB: {
          ENG: [{ name: 'London' }, { name: 'Manchester' }],
          SCT: [{ name: 'Edinburgh' }, { name: 'Glasgow' }],
        },
      };
      console.log(`Using fallback cities for ${normalizedCode}/${stateCode}:, fallbackCities[normalizedCode]?.[stateCode] || []`);
      return fallbackCities[normalizedCode]?.[stateCode] || [];
    }
    return cities;
  } catch (error) {
    console.error(`Error fetching cities for ${countryCode}/${stateCode}:, error.message`);
    return [];
  }
};