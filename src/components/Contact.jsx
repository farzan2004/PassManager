import React from 'react';

const Contact = () => {
  return (
    <div className="relative min-h-screen flex justify-center items-center">
    <div className="absolute inset-0 -z-10 h-full w-full bg-purple-500 bg-[radial-gradient(circle_at_top,#fff_20%,#63e_90%)]"></div>
      <div className='rounded-full md:h-[27rem] md:w-[27rem] h-[21rem] w-[21rem] gap-2 flex flex-col justify-center items-center bg-purple-200 text-center'>
        <div className='font-extrabold'>Have any suggestions, questions or message for us?</div>
        <p><span className='font-semibold'>Instagram:</span> instagram.com/farzan__rashid</p>
        <p><span className='font-semibold'>Linkedin:</span> linkedin.com/in/farzan-rashid-2004oct05</p>
        <p><span className='font-semibold'>Twitter(X):</span> @FarzanRashid123</p>
      </div>   
    </div>
  );
};

export default Contact;