export const getStatusColor = (status)=>{
   let color = "white";
    switch (status) {
        case "Available":
            color="Green";
            break;

            case "Busy":
                color="Yellow";
            break;

            case "Away":
                color="Red";
            break;
    
        default:
            color="white";
            break;
    }
    return color;
}