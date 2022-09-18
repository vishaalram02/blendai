import { useState, useEffect } from 'react';
import { useTrail, animated as a } from 'react-spring';
import { Group, Text, Container, Title, Center, Stack } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useImageStore } from "../hooks/useImageStore";

export function FileUpload() {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleWindowMouseMove = (e: any) => {
            setGlobalCoords({
                x: e.screenX,
                y: e.screenY,
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
        };
    }, []);
    const handleMouseMove = (event: any) => {
        setCoords({
            x: event.clientX - event.target.offsetLeft,
            y: event.clientY - event.target.offsetTop,
        });
    };

    const updateImage = useImageStore(store => store.updateImage);

    const letters = 'Blend anything you can imagine into reality'.split('');
    const config = { mass: 5, tension: 2000, friction: 200 };

    const trail = useTrail(letters.length, {
        config,
        opacity: true ? 1 : 0,
        x: true ? 0 : 20,
        height: true ? 80 : 0,
        from: { opacity: 0, x: 20, height: 0 }
    });

    return (
        <Container size="lg">
            <Center>
                <Stack>
                    <Title onMouseMove={handleMouseMove} size={80} variant="gradient" gradient={{ from: 'green.2', to: 'green.1', deg: coords.x }} style={{ userSelect: "none", fontFamily: "Nunito", marginTop: 10, textAlign: "center" }}>
                        Blend.ai
                    </Title>
                    <Text style={{ marginBottom: 40, fontFamily: "Verdana", fontStyle: "italic" }} size={20}>
                        <span>
                            {trail.map(({ x, height, ...rest }, index) => (
                                <a.span
                                    key={index}
                                    className="trails-text"
                                    style={{
                                        ...rest,
                                        transform: x.to(x => `translate3d(0,${x}px,0)`)
                                    }}>
                                    <a.span style={{ height }}>{letters[index]}</a.span>
                                </a.span>
                            ))}
                        </span>
                    </Text>

                </Stack>

            </Center>
            <Dropzone
                onDrop={(files) => updateImage(files[0])}
                onReject={(files) => console.log('rejected files', files)}
                maxFiles={1}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
            >
                <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IconUpload
                            size={50}
                            stroke={1.5}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size={50}
                            stroke={1.5}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto size={50} stroke={1.5} />
                    </Dropzone.Idle>
                    <div>
                        <Text size="xl" inline>
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>
        </Container>
    );
}