import React from "react";
import styled from "styled-components";
import chroma from "chroma-js";

const MAIN_COLOR = "rgb(67, 103, 193)";
const FULL_WIDTH = "990px";

const Background = styled.div`
  background-color: ${chroma(MAIN_COLOR)
    .alpha(0.01)
    .css()};
`;

const Container = styled.div`
  padding: 20px;
  @media (min-width: 600px) {
    padding-top: 60px;
    padding-bottom: 60px;
  }
  @media (min-width: 920px) {
    padding: 80px 0;
  }
  max-width: ${FULL_WIDTH};
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
  color: ${MAIN_COLOR};
  font-weight: 400;
`;

const Grid = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 610px;
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 30px;
  grid-template-areas: "name-title" "about-info" "experience-section"
    "zetta-title" "zetta-job" "ask-ziggy-title" "ask-ziggy-job" "mini-job"
    "skills-section" "skills";
  font-weight: 300;

  @media (min-width: 920px) {
    font-weight: 400;
    width: auto;
    grid-column-gap: 40px;
    grid-row-gap: 60px;
    grid-template-columns: 1fr 217px 610px 1fr;
    grid-template-areas: ".                   name-title          about-info         ."
      ".                   experience-section  experience-section ."
      ".                   zetta-title         zetta-job          ."
      ".                   ask-ziggy-title     ask-ziggy-job      ."
      ".                   mini-job            mini-job           ."
      ".                   skills-section      skills-section     ."
      ".                   skills              skills             .";
  }
`;

const Job = styled.div`
  font-weight: 500;
`;

const GridArea = styled.div`
  grid-area: ${({ value }) => value};
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div``;

const VerticalRule = styled.div`
  border-left: 1px solid;
  margin: 0 0.6em;
  opacity: 0.2;
  margin-top: 3px;
  margin-bottom: 3px;
`;

const Small = styled.div`
  font-size: 80%;
  opacity: 0.5;
  line-height: 1.5;
`;

const Br = styled.div`
  display: inline;
`;

const SectionBase = styled.div`
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  font-size: 80%;
`;

const Section = SectionBase.extend`
  border-top: 2px solid;
  padding-top: 8px;
  line-height: 1;

  margin: 20px 0;
  font-weight: 600;

  padding-top: 30px;
  font-size: 22px;

  @media (min-width: 920px) {
    padding-top: 60px;
    font-size: 40px;
  }
`;

const List = styled.ul`
  list-style: none;
  li {
    padding-bottom: 0.4em;
  }
  li:last-child {
    padding-bottom: 0;
  }
  li + li {
    padding-top: 0.4em;
    border-top: 1px solid
      ${chroma(MAIN_COLOR)
        .alpha(0.2)
        .css()};
  }
`;

const Text = styled.div`
  font-weight: ${({ weight }) => weight};
`;

// --

const JobAndTitle = ({ job, title = "", started, ended = "Present" }) => [
  <Job>{job}</Job>,
  <Small>
    {title && title + " "}({started} — {ended})
  </Small>
];

const Resume = () => (
  <Background>
    <Container>
      <Grid>
        <GridArea value="name-title">
          <Text weight={700}>Mark Miro</Text>
          <Small>UI Engineer</Small>
        </GridArea>

        <GridArea value="about-info">
          <FlexRow>
            <Column>
              <Small>
                916-668-1717<Br />
                San Francisco, CA
              </Small>
            </Column>
            <Column>
              <Small>
                markmiro.com<Br />
                contact@markmiro.com
              </Small>
            </Column>
            <Column style={{ display: "flex" }}>
              <SectionBase>Interests</SectionBase>
              <VerticalRule />
              <Small>
                <ul style={{ listStyle: "none" }}>
                  <li>Organizing chaos</li>
                  <li>Navigation systems</li>
                  <li>Design</li>
                  <li>Color vision</li>
                </ul>
              </Small>
            </Column>
          </FlexRow>
        </GridArea>

        <GridArea value="experience-section">
          <Section>Experience</Section>
        </GridArea>

        <GridArea value="zetta-title">
          <JobAndTitle job="Zetta" title="Lead UI Engineer" started="2014" />
        </GridArea>
        <GridArea value="zetta-job">
          <List>
            <li>
              In our biggest deals my UI work was mentioned as one of the<Br />deciding
              factors for choosing us
            </li>
            <li>Two raises and one promotion in the first year</li>
            <li>
              Accelerated the pace of development while cleaning up the codebase
            </li>
            <li>
              <Small>
                Drove all the front-end archituctural decisions • Was the
                point-person when boss was on vacation •<Br />Ran and initiated
                usability tests and user interviews • Gave several company-wide
                presentaions
              </Small>
            </li>
          </List>
        </GridArea>

        <GridArea value="ask-ziggy-title">
          <JobAndTitle
            job="Ask Ziggy"
            title="Lead of UX / Software Engineer"
            started="2012"
            ended="2014"
          />
        </GridArea>
        <GridArea value="ask-ziggy-job">
          Created prototype apps that integrated voice and gesture to help
          answer<Br />what the next generation of human-computer interaction
          looks like
          <Small>Also interviewed tech talent and ran user tests</Small>
        </GridArea>

        <GridArea value="mini-job">
          <FlexRow>
            <Column>
              <JobAndTitle
                job="UC Davis ITS"
                title="Team Lead / Web Developer"
                started="2011"
                ended="2012"
              />
              <Small style={{ marginTop: "0.7em" }}>
                Redesigned the website and created a custom Wordpress template
                for it •<Br />The website moved up to #1 in Google for
                “transportation studies” as a result<Br />(but no longer) • The
                template was later used in 4 additional departments
              </Small>
            </Column>

            <Column>
              <JobAndTitle job="Freelance" started="2009" ended="2012" />
              <Small style={{ marginTop: "0.7em" }}>
                Made websites in Flash • Fixed major bugs that<Br />impacted
                almost a quarter million users
              </Small>
            </Column>
          </FlexRow>
        </GridArea>

        <GridArea value="skills-section">
          <Section>Skills</Section>
        </GridArea>

        <GridArea value="skills">
          <FlexRow>
            <Column>
              Javascript ES6
              <Small>• React.js</Small>
              <Small>• Node.js</Small>
            </Column>
            <Column>
              CSS3
              <Small>• Sass</Small>
              <Small>• Bootstrap</Small>
            </Column>
            <Column>
              Photoshop • Illustrator • Sketch<Br />
              Git • Regex
            </Column>
            <Column>
              <Small>
                Some professional experience in: Objective-C<Br />
                (iOS), Java (Android), PHP, Bash Scripting
              </Small>
            </Column>
          </FlexRow>
        </GridArea>
      </Grid>
    </Container>
  </Background>
);

export default Resume;
