import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export const Address = ({ address,setAddress }) => {
  const {
    placePredictions,
    getPlacePredictions,
  } = usePlacesService({
    apiKey: "AIzaSyBR1AIqhZpgpu67mr9ht0UaOkfuvkRAQBA",
  });

  return (
    <div>
      <span>Debounced</span>
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