import React from 'react';

const Contact = () => {
  return (
    <div className='flex justify-center flex-col items-center align-middle [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] w-full min-h-screen gap-5'>
      <div className='font-extrabold'>Contact Us</div>
      <p><span className='font-semibold'>Instagram:</span> @your_instagram_handle</p>
      <p><span className='font-semibold'>Twitter:</span> @your_twitter_handle</p>
      <p><span className='font-semibold'>WhatsApp:</span> +1234567890</p>
    </div>
  );
};

export default Contact;