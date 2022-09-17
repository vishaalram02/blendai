import { useState } from 'react';
import { Navbar, Center, Tooltip, Group, MediaQuery, Button, TextInput, createStyles, Footer, Slider } from '@mantine/core';
import {
  TablerIcon,
  IconBrush,
  IconZoomIn,
  IconWand,
  IconRectangle,
  IconLasso,
  IconColorPicker,
  IconBucket,
  IconHandStop,
  IconReload
} from '@tabler/icons';
import {ReactComponent as Logo} from '../assets/logo.svg';

const useStyles = createStyles((theme) => ({
    footer: {
        padding: "10px !important"
    },
    slider: {
        width: "150px"
    },
    sliderTitle: {
        fontSize: "1.2em"
    },
    hide: {
        display: "none"
    },
    input: {
      width: "40vw"
    }
  }),
);


export function FooterBar() {
  const [promptActive, setPromptActive] = useState(true);
  const { classes, cx } = useStyles();

  return (
    <Footer height={60} className={classes.footer} p="md" >

        <Group position="right">

            <Group>
                <span className={classes.sliderTitle}> Seed: </span>
                <Slider
                    size="lg"
                    className={classes.slider}
                    showLabelOnHover={false}
                    marks={[
                        { value: 0, label: '0' },
                        { value: 100, label: '100' },
                    ]}
                />
            </Group>

            
            <TextInput className={classes.input}
                placeholder="Your prompt"
                radius="md"
                size="sm"
                withAsterisk
            />
            <Button>Generate</Button>

        </Group>
    
        
    </Footer>
  );
}