import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]); // Ülkelerin bilgilerini tutan, başlangıç için boş bir dize
  const [selectedCountry, setSelectedCountry] = useState(null); // Kullacının Ip üzerinden alınann ülke bilgisini tutan, null değer 
  const [phoneNumber, setPhoneNumber] = useState(''); // Kullacının alıcı kodu hariç gireceği telefon numarasını alan string
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {                            
    fetch('https://restcountries.com/v3.1/all') // Ülke bilgilerini çektiğimiz kaynak 
      .then(response => response.json())
      .then(data => {
        setCountries(data);  // Gelen veriyi Countries'de saklıyorum 
      });
  }, []);

  useEffect(() => {
    fetch('https://ipapi.co/json/') // Kullacının Ip adresine göre ülke kodu aldığımız alan 
      .then(response => response.json())
      .then(data => {
        const userCountryCode = data.country_code;
        const foundCountry = countries.find(c => c.cca2 === userCountryCode);
        if (foundCountry) {                        // Bu ülke kodunu kullanarak, countries içinde uygun ülkeyi bulur ve bu ülkeyi selectedCountry state'ine ayarlıyor
          setSelectedCountry(foundCountry);
          setPhoneNumber(foundCountry.idd.root + foundCountry.idd.suffixes[0]); 
        }
      });
  }, [countries]);

  const handleCountrySelect = (country) => {    // Seçilen ülke selectedcountry statine ayarlıyor, phonenumbera ise telefon kodunu ayarlıyor bu kısım... :)
    setSelectedCountry(country);
    setPhoneNumber(country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''));
    setShowModal(false);
  };

  const handlePhoneNumberChange = (event) => {
    const phoneSuffix = event.target.value.slice(0, 15);    // toplam her ülkede kabul edilen max numara alanı (genelde 10'dur.)
    const fullPhoneNumber = selectedCountry.idd.root + selectedCountry.idd.suffixes[0] + phoneSuffix;
    setPhoneNumber(fullPhoneNumber);            // son girilen numara alanı 
  };

  const handleSubmit = () => {
    console.log('Ülke:', selectedCountry, 'Telefon Numarası:', phoneNumber);
  };
 

  return (
    <div className="app-container">
    <div className="content">
      <h1 className="title">Kullanıcının Ülkesi</h1>
      {selectedCountry ? (
        <div>
          <div className="input-area">
            <img src={selectedCountry.flags.png} alt="Bayrak" className="flag" />
            <div className="phone-number-input">
              <p>({selectedCountry.idd.root + selectedCountry.idd.suffixes[0]})</p>
              <input
                type="text"
                value={phoneNumber.substring(selectedCountry.idd.root.length + selectedCountry.idd.suffixes[0].length)}
                onChange={handlePhoneNumberChange}
                placeholder="Telefon Numaranız"
              />
            </div>
          </div>
          <div className="submit-button">
            <button onClick={handleSubmit}>Devam Et</button>  
          </div>
        </div>
      ) : (
        <button onClick={() => setShowModal(true)}>Ülke Seç</button>
      )}
    </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {countries.map((country, index) => (
              <div key={index} className="country-option" onClick={() => handleCountrySelect(country)}>
                <img src={country.flags.png} alt={`${country.name.common} bayrağı`} />
                <span>{country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
