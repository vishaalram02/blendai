import { useState } from 'react';
import { ActionIcon, Popover, Navbar, Center, Tooltip, Group, MediaQuery, Button, TextInput, createStyles, Footer, Slider, UnstyledButton, Collapse, Container } from '@mantine/core';
import {
  IconReload, 
  IconTrash,
} from '@tabler/icons';
import {ReactComponent as Logo} from '../assets/logo.svg';
import { IconAdjustmentsHorizontal } from '@tabler/icons';
import { useImageStore } from '../hooks/useImageStore';
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

type FooterBarProps = {
  genImage: (prompt:string) => () => void,
  loading: boolean,
};

export function FooterBar({genImage, loading}: FooterBarProps,) {
  const [opened, setOpened] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { classes, cx } = useStyles();
  const [seed, updateSeed, image, updateImage, deleteImage] = useImageStore(store => [store.seed, store.updateSeed, store.image, store.updateImage, store.deleteImage])

  return (
    <Footer height={60} className={classes.footer} p="md" >
        <Group position="right">
            <Popover width={250} position="top" withArrow shadow="md">
              <Popover.Target>
                <Tooltip label={"Parameters"} position="top" transitionDuration={0}>
                <ActionIcon color="green.1" variant="filled">
                  <IconAdjustmentsHorizontal />
                </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
              <Group style={{marginBottom: 5}}>
                    <Tooltip label = {"Random state initializer"}>
                      <span className={classes.sliderTitle}> Seed: </span>
                    </Tooltip>
                    <Slider
                        size="md"
                        value={seed}
                        onChange={updateSeed}
                        className={classes.slider}
                        showLabelOnHover={false}
                        marks={[
                            { value: 0, label: '0' },
                            { value: 100, label: '100' },
                        ]}
                    />
                </Group>
              </Popover.Dropdown>
            </Popover>

            
            <TextInput className={classes.input}
                placeholder="Your prompt"
                radius="md"
                size="sm"
                value={prompt}
                onChange={(event) => setPrompt(event.currentTarget.value)}
                disabled = {!image || loading}
            />
            <Button disabled = {!image || loading} color="green.1" onClick = {genImage(prompt)}>Generate</Button>
            <Tooltip label={"Reload"} position="top" transitionDuration={0}>
                <ActionIcon>
                    <IconReload stroke={1.5} />
                </ActionIcon>
                
            </Tooltip>
            <Tooltip label={"Delete"} position="top" transitionDuration={0}>
              <ActionIcon onClick={() => deleteImage()} color="red.0" variant="filled">
                <IconTrash />
              </ActionIcon>
            </Tooltip>
                    
            {/* <Tooltip label={label} position="right" transitionDuration={0}>
                <UnstyledButton >
                    <Icon stroke={1.5} />
                </UnstyledButton>
            </Tooltip> */}

        </Group>
    </Footer>
  );
}