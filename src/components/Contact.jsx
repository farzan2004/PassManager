import React from 'react';

const Contact = () => {
  return (
    <div className='flex justify-center items-center align-middle [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] w-full min-h-screen'>
      <div className='rounded-full h-[27rem] w-[27rem] gap-2 flex flex-col justify-center items-center bg-purple-200'>
        <div className='font-extrabold bg'>Have any suggestions, questions or message for us?</div>
        <p><span className='font-semibold'>Instagram:</span> www.instagram.com/farzan__rashid/</p>
        <p><span className='font-semibold'>Linkedin:</span> linkedin.com/in/farzan-rashid-2004oct05</p>
        <p><span className='font-semibold'>Twitter(X):</span> @FarzanRashid123</p>
      </div>   
    </div>
  );
};

export default Contact;