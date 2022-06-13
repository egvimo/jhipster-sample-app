package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc17Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc17.class);
        Abc17 abc171 = new Abc17();
        abc171.setId(1L);
        Abc17 abc172 = new Abc17();
        abc172.setId(abc171.getId());
        assertThat(abc171).isEqualTo(abc172);
        abc172.setId(2L);
        assertThat(abc171).isNotEqualTo(abc172);
        abc171.setId(null);
        assertThat(abc171).isNotEqualTo(abc172);
    }
}
