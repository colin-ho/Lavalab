import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export default function Address  ({ address,setAddress }) {
  const {
    placePredictions,
    getPlacePredictions,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  return (
    <div>
      <span>Debounced</span>
      {console.log(process.env)}
      <input
        style={{ color: "black" }}
        value={address}
        placeholder="Debounce 500 ms"
        onChange={(evt) => {
          getPlacePredictions({ input: evt.target.value });
          setAddress(evt.target.value);
        }}
      />
      <div style={{display:"flex",flexDirection:"column"}}>
        {placePredictions && (
            <>{placePredictions.map((item)=>{
                return(
                <button key = {item.description} onClick={() => setAddress(item.description)}>
                    {item.description}
                </button>
                )
            })}</>
        )}
      </div>
    </div>
  );
};