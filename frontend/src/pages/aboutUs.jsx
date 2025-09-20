import React from 'react';
// 1. Import your photo from your project's `src` folder.
import Me from '../assets/Me.jpg'; // Make sure to place your photo at this path
import { FaGithub } from 'react-icons/fa'; // Import the GitHub icon
import Header from '../components/header';

const AboutUs = () => {
  // You can replace this with your actual data
  const teamMember = {
    name: 'Juan Mike',
    title: 'Main dev',
    bio: 'I am a passionate developer with a love for creating amazing user experiences.',
    imageUrl: Me, // 2. Use the imported image variable here
    githubUrl: 'https://github.com/juanvictorqwerty/FinanceClear', // Add your GitHub profile URL here
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '300px',
    margin: '20px auto',
    textAlign: 'center',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
  };

  const imageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
  };

  const nameStyle = {
    fontSize: '1.5em',
    margin: '10px 0',
  };

  const titleStyle = {
    color: '#777',
    fontSize: '1em',
    marginBottom: '10px',
  };

  const bioStyle = {
    fontSize: '0.9em',
    color: '#555',
  };

  const socialLinkStyle = {
    display: 'inline-block',
    marginTop: '15px',
    color: '#333',
    fontSize: '2em', // Makes the icon larger
    textDecoration: 'none',
  };

  const githubIconStyle = {
    transition: 'transform 0.2s',
  };

  return (
    <>
      <Header />

    <div>
      <h1 style={{ textAlign: 'center' }}>About Us</h1>
      <div style={cardStyle}>
        <img
          src={teamMember.imageUrl}
          alt={`Photo of ${teamMember.name}`}
          style={imageStyle}
        />
        <h2 style={nameStyle}>{teamMember.name}</h2>
        <p style={titleStyle}>{teamMember.title}</p>
        <p style={bioStyle}>{teamMember.bio}</p>
        <a
          href={teamMember.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={socialLinkStyle}
          title={`Visit ${teamMember.name}'s GitHub`}
          onMouseOver={(e) => e.currentTarget.firstChild.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.firstChild.style.transform = 'scale(1)'}>
          <FaGithub style={githubIconStyle} />
        </a>
      </div>
    </div>
    </>
  );
};

export default AboutUs;