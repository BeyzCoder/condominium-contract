export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'short', day: '2-digit'};
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
    return formattedDate;
};