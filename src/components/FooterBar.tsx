import { useState } from 'react';
import { ActionIcon, Popover, Navbar, Center, Tooltip, Group, MediaQuery, Button, TextInput, createStyles, Footer, Slider, UnstyledButton, Collapse, Container } from '@mantine/core';
import {
  IconReload, 
  IconTrash,
} from '@tabler/icons';
import {ReactComponent as Logo} from '../assets/logo.svg';
import { IconAdjustmentsHorizontal, IconArrowBack, IconArrowForwardUp} from '@tabler/icons';
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
  genImage: (prompt:string, seed:number) => () => void,
  loading: boolean,
};

export function FooterBar({genImage, loading}: FooterBarProps,) {
  const [opened, setOpened] = useState(false);
  const [prompt, setPrompt] = useState("");

  const { classes, cx } = useStyles();
  const [seed, updateSeed, image, updateImage, deleteImage, undo, redo] = useImageStore(store => [store.seed, store.updateSeed, store.image, store.updateImage, store.deleteImage, store.undo, store.redo])

  return (
    <Footer height={60} className={classes.footer} p="md" >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Group position="left" style={{marginLeft: 20}}>
        <Tooltip label={"Previous Image"} position="top" transitionDuration={0}>
          <ActionIcon onClick={() => undo()}>
            <IconArrowBack />
          </ActionIcon>
          </Tooltip>
          <Tooltip label={"Next Image"} position="top" transitionDuration={0}>
          <ActionIcon onClick={() => redo()}>
            <IconArrowForwardUp />
          </ActionIcon>
          </Tooltip>
        </Group>
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
                    <Tooltip label = {"Picks the best image out of # iterations"}>
                      <span className={classes.sliderTitle}> Iterations: </span>
                    </Tooltip>
                    <Slider style={{width: 100}}
                        size="md"
                        disabled={loading}
                        value={seed}
                        onChange={updateSeed}
                        className={classes.slider}
                        showLabelOnHover={false}
                        min={1}
                        max={16}
                        step={1}
                        marks={[
                            { value: 1, label: '1' },
                            { value: 16, label: '16' },
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
            <Button disabled = {!image || loading} color="green.1" onClick = {genImage(prompt, seed)}>Generate</Button>
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
        </div>
    </Footer>
  );
}