import { useState } from 'react';
import { Group, Text, Container, Title } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useImageStore } from "../hooks/useImageStore";

export function FileUpload () {
    const updateImage = useImageStore(store => store.updateImage);
    return (
        <Container size="lg">
            <Text variant="gradient">
                asdlfj;aslkdf asdlk;fjasl
            </Text>
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