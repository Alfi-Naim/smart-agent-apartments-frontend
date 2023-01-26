import './Post.css';
import exportIcon from '../../images/export.svg'

function Post({ item }) {

  let rooms = item.rooms.split(" ");
  if (rooms.length > 2) rooms = ["-"];
  else if (isNaN(rooms[0])) rooms[0] = 1;
  let floor = item.floor.split(" ");

  return (
    <>
      <div className='post__title-container'>
        <h3 className='post__street'>{item.street}</h3>
        <p className='post__neighborhood'>{item.neighborhood}</p>
      </div>
      <div className='post__info-container'>
        <div className='post__info'>
          <h3 className='post__info-title'>חדרים</h3>
          <p className='post__info-subtitle'>{rooms[0]}</p>
        </div>
        <div className='post__info'>
          <h3 className='post__info-title'>קומה</h3>
          <p className='post__info-subtitle'>{floor[1]}</p>
        </div>
        <div className='post__info'>
          <h3 className='post__info-title'>מ"ר</h3>
          <p className='post__info-subtitle'>{item.squareMeters}</p>
        </div>
      </div>
      <div className='post__price-container'>
        <a href={item.link} target="_blank"><img className='post__export-img' src={exportIcon} /></a>
        <p className='post__price'>{item.price}</p>
      </div>
    </>
  );
}

export default Post;
