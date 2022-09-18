import { Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack, Text, Menu, Slider, ColorInput, Popover } from '@mantine/core';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { tools, useToolSelect } from "../hooks/useToolSelect";
import { IconPalette, IconArrowsDiagonal, TablerIcon } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useImageStore } from '../hooks/useImageStore';

const useStyles = createStyles((theme) => ({
  link: {
    width: 30,
    height: 30,
    padding: 5,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  navbar: {
    top: 0,
  },

  active: {
    '&, &:hover': {
      color: theme.colors.green[1],
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  customize: boolean;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, customize, active, onClick }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  const [brushSize, setBrushSize] = useToolSelect(state => [state.brushSize, state.changeBrushSize]);
  const [opened, open] = useState(false);

  const Wrapper = ({ children }: { children: JSX.Element }) => {
    if (customize && active) {
      return (
        <Popover
          onChange={open}
          opened={opened}
          trapFocus
          position="right-start"
          withArrow
          shadow="md"
          width={200}
        >
          <Popover.Target>
            {children}
          </Popover.Target>
          <Popover.Dropdown sx={(theme) => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
            <Stack spacing={12}>
              <Stack spacing={4}>
                <Text size="sm">Brush Size</Text>
                <Slider
                  data-autofocus
                  value={brushSize}
                  min={1}
                  max={45}
                  // defaultValue={brushSize}
                  onChange={setBrushSize}
                  color="green.1"
                  size="xs"
                />
              </Stack>
              <ColorInput label="Color" defaultValue="#9ACC59" />
            </Stack>
          </Popover.Dropdown>
        </Popover >
      );
    } else {
      return (
        <>
          {children}
        </>
      );
    }
  }

  return (
    <Wrapper>
      {!(active && customize) ? (<Tooltip label={label} position="right" transitionDuration={0}>
        <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
          <Icon stroke={1.5} />
        </UnstyledButton>
      </Tooltip >) : <UnstyledButton onClick={() => open(true)} className={cx(classes.link, { [classes.active]: active })}>
        <Icon stroke={1.5} />
      </UnstyledButton>}

    </Wrapper >
  );
}

export function ToolSidebar() {
  const [active, setActive] = useToolSelect((state) => [state.selectedTool, state.changeTool]);
  const { classes, cx } = useStyles();
  const [undo, redo] = useImageStore(store => [store.undo, store.redo]);

  const links = tools.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <Navbar width={{ base: 60 }} className={classes.navbar} p="md">
      <Center>
        <Logo />
      </Center>
      <Navbar.Section grow mt={80}>
        <Stack justify="center" spacing={15}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink icon={IconLogout} label="Logout" /> */}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}